import { Client } from '@notionhq/client'
import {
  PageObjectResponse,
  QueryDatabaseParameters,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints'

import { PageSummary } from '@/interfaces/notion'
import { HttpResponse } from '@/server/types'

export const getNotionPagesController = async (
  client: Client,
  database_id: string = process.env.NOTION_DEFAULT_DB_ID || '',
  filters?: QueryDatabaseParameters['filter'],
  query?: string,
  filterByCreator?: boolean, // Optional - if undefined, auto-enable when user ID is stored
  userId?: string // User ID to fetch stored Notion user ID from connection
): Promise<HttpResponse<PageSummary[]>> => {
  try {
    if (!database_id) {
      throw new Error('Database ID is required')
    }

    // Get the current user's Notion user ID to filter by creator
    // Always try to fetch it from the stored connection, enable filtering by default if found
    let currentUserId: string | null = null
    // Default behavior: filter by creator when we have a stored user ID
    // Only disable if explicitly set to false (for import modal)
    let shouldFilterByCreator = filterByCreator !== false // Default to true unless explicitly false

    if (userId) {
      try {
        // Fetch the stored Notion user ID from the connection
        const { createSupabaseServerClient } = await import('@/server/utils')
        const supabase = createSupabaseServerClient()
        const { data: connection } = await supabase
          .from('notion_connections')
          .select('notion_user_id')
          .eq('user_id', userId)
          .single()

        if (connection?.notion_user_id) {
          currentUserId = connection.notion_user_id
          // Filtering is enabled by default when we have a stored user ID
          if (filterByCreator === false) {
            shouldFilterByCreator = false
          } else {
            shouldFilterByCreator = true
          }
        } else {
          // No stored user ID - can't filter
          shouldFilterByCreator = false
        }
      } catch (err) {
        shouldFilterByCreator = false
      }
    } else {
      shouldFilterByCreator = false
    }

    const queryParams: QueryDatabaseParameters = {
      database_id,
    }

    // If there's a text query, use it to search
    if (query && query.trim()) {
      // Use search API for text queries, then filter by database and creator
      const searchResults = await client.search({
        query: query.trim(),
        filter: {
          value: 'page',
          property: 'object',
        },
        sort: {
          direction: 'descending',
          timestamp: 'last_edited_time',
        },
      })

      // Filter results to only include pages from the specified database
      let filteredResults = searchResults.results.filter((result) => {
        if ('parent' in result && result.parent.type === 'database_id') {
          return result.parent.database_id === database_id
        }
        return false
      })

      // Further filter by creator if requested and we have the user ID
      if (shouldFilterByCreator && currentUserId) {
        filteredResults = filteredResults.filter((result) => {
          if ('created_by' in result && result.created_by) {
            return result.created_by.id === currentUserId
          }
          return false
        })
      }

      return {
        data: formatNotionAccomplishments({
          results: filteredResults as any,
          has_more: false,
          next_cursor: null,
          object: 'list',
          type: 'page_or_database',
          page_or_database: filteredResults as any,
        } as QueryDatabaseResponse),
        status: 200,
      }
    }

    // Otherwise, use database query with filters
    // First, retrieve the database to check available properties
    let databaseProperties: Record<string, any> = {}
    try {
      const database = await client.databases.retrieve({ database_id })
      if ('properties' in database) {
        databaseProperties = database.properties
      }
    } catch (err) {
      // Silently fail - will filter after fetching instead
    }

    // Build filter: combine user-provided filters with created_by filter
    // Note: created_by is a system property, not a database property
    // Check if there's a "Created By" property in the database schema
    let combinedFilter: QueryDatabaseParameters['filter'] = filters

    if (shouldFilterByCreator && currentUserId) {
      // Check if there's a "Created By" or similar property in the database
      const createdByProperty = Object.entries(databaseProperties).find(
        ([key, prop]) =>
          (key.toLowerCase().includes('created') && key.toLowerCase().includes('by')) ||
          (prop.type === 'people' && key.toLowerCase().includes('created'))
      )

      if (createdByProperty) {
        // Use the database property for filtering
        const [propertyName, property] = createdByProperty

        if (property.type === 'people') {
          // For people properties, use the people filter
          const creatorFilter = {
            property: propertyName,
            people: {
              contains: currentUserId,
            },
          }

          if (combinedFilter) {
            // Combine filters with AND logic
            combinedFilter = {
              and: [combinedFilter, creatorFilter] as any,
            } as QueryDatabaseParameters['filter']
          } else {
            combinedFilter = creatorFilter as QueryDatabaseParameters['filter']
          }
        } else if (property.type === 'created_by') {
          // For created_by system properties, database query filters don't work reliably
          // We'll filter after fetching instead
        }
        // For other property types, filter after fetching
      }
      // If no created_by property in database, filter results after fetching
    }

    if (combinedFilter) {
      queryParams.filter = combinedFilter
    }

    let pages: QueryDatabaseResponse
    try {
      pages = await client.databases.query(queryParams)
    } catch (error: any) {
      // If the query failed (possibly due to filter), try without the creator filter
      if (combinedFilter && shouldFilterByCreator) {
        const retryParams = { ...queryParams }
        // Remove creator filter but keep other filters
        if (filters) {
          retryParams.filter = filters
        } else {
          delete retryParams.filter
        }
        pages = await client.databases.query(retryParams)
      } else {
        throw error
      }
    }

    // Filter by creator after fetching (only if we have a reliable user ID)
    if (shouldFilterByCreator && currentUserId) {
      // Filter by system created_by property on pages
      pages.results = pages.results.filter((result: any) => {
        if (result.created_by && result.created_by.id) {
          return result.created_by.id === currentUserId
        }
        return false
      })
    }

    return {
      data: formatNotionAccomplishments(pages),
      status: 200,
    }
  } catch (error) {
    return {
      data: [],
      status: 500,
    }
  }
}

const formatNotionAccomplishments = (pages: QueryDatabaseResponse): PageSummary[] => {
  const pageSummaries: PageSummary[] = []
  for (const page of pages.results as (PageObjectResponse & {
    properties: Record<string, any>
  })[]) {
    // Try to find title property (could be named "Name", "Title", or be the first title property)
    let title = 'Untitled'
    let summary = null
    let completionDate = null
    let accomplishmentType = null

    // Find title property
    for (const [key, prop] of Object.entries(page.properties || {})) {
      if (prop.type === 'title' && prop.title && prop.title.length > 0) {
        title = prop.title[0].plain_text || 'Untitled'
        break
      }
    }

    // Try common property names for summary/description
    const summaryKeys = ['Summary', 'Description', 'Notes', 'Details']
    for (const key of summaryKeys) {
      const prop = page.properties[key]
      if (prop?.type === 'rich_text' && prop.rich_text && prop.rich_text.length > 0) {
        summary = prop.rich_text[0].plain_text || null
        break
      }
    }

    // Try common property names for date
    const dateKeys = ['Date', 'Completion Date', 'Due Date', 'Created', 'Last Edited']
    for (const key of dateKeys) {
      const prop = page.properties[key]
      if (prop?.type === 'date' && prop.date) {
        completionDate = prop.date.start || null
        break
      }
    }

    // Try common property names for type/status
    const typeKeys = ['Task Type', 'Type', 'Status', 'Category']
    for (const key of typeKeys) {
      const prop = page.properties[key]
      if (prop?.type === 'select' && prop.select) {
        accomplishmentType = prop.select.name || null
        break
      } else if (prop?.type === 'status' && prop.status) {
        accomplishmentType = prop.status.name || null
        break
      }
    }

    pageSummaries.push({
      id: page.id,
      title,
      summary: summary || 'No summary available',
      completionDate,
      accomplishmentType: accomplishmentType || 'Unknown',
    })
  }
  return pageSummaries
}
