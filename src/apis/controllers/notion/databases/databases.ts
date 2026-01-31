import { Client } from '@notionhq/client'
import { DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints'

import { NotionDatabase } from '@/interfaces/notion'
import { HttpResponse } from '@/server/types'

export const getNotionDatabasesController = async (
  notion: Client
): Promise<
  HttpResponse<{
    databases: NotionDatabase[]
    defaultFilter?: {
      property: string
      status: {
        equals: string
      }
    }
  }>
> => {
  try {
    const response = await notion.search({
      query: '',
      filter: {
        value: 'database',
        property: 'object',
      },
      sort: {
        direction: 'ascending',
        timestamp: 'last_edited_time',
      },
    })
    const firstDatabase = response.results.find(
      (result): result is DatabaseObjectResponse => 'properties' in result
    )
    let defaultFilter
    if (firstDatabase) {
      const statusProperty = Object.entries(firstDatabase.properties).find(
        ([, property]) => property.type === 'status'
      )
      defaultFilter = {
        property: statusProperty?.[0] ?? '',
        status: {
          equals:
            statusProperty?.[1].type === 'status'
              ? statusProperty[1].status.options[0].name
              : 'N/A',
        },
      }
    }

    return {
      data: {
        databases: formatNotionDatabases(response.results as DatabaseObjectResponse[]),
        defaultFilter,
      },
      status: 200,
    }
  } catch (error) {
    return {
      data: { databases: {} as NotionDatabase[], defaultFilter: undefined },
      status: 500,
    }
  }
}

const formatNotionDatabases = (dbs: DatabaseObjectResponse[]): NotionDatabase[] => {
  const databases: NotionDatabase[] = []
  for (const db of dbs as (DatabaseObjectResponse & {
    properties: {
      title: {
        rich_text: {
          plain_text: string | null
        }[]
      }
      id: string
    }
  })[]) {
    databases.push({
      title: db.title[0].plain_text,
      id: db.id,
    })
  }
  return databases
}
