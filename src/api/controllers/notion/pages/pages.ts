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
  filters: QueryDatabaseParameters['filter']
): Promise<HttpResponse<PageSummary[]>> => {
  try {
    if (!database_id) {
      throw new Error('Database ID is required')
    }

    const pages: QueryDatabaseResponse = await client.databases.query({
      database_id,
      filter: filters,
    })

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
    properties: {
      'AI summary': {
        rich_text: {
          plain_text: string | null
        }[]
      }
      Name: {
        title: {
          plain_text: string | null
        }[]
      }
      'Completion Date': {
        date: {
          start: string | null
          end: string | null
          time_zone: string | null
        }
      }
      'Accomplishment Type': {
        select: {
          name: string | null
        }
      }
    }
  })[]) {
    pageSummaries.push({
      title: page?.properties.Name.title[0].plain_text,
      summary: page?.properties['AI summary']?.rich_text[0].plain_text,
      completionDate: page?.properties['Completion Date']?.date.start,
      accomplishmentType: page?.properties['Accomplishment Type']?.select?.name,
    })
  }
  return pageSummaries
}
