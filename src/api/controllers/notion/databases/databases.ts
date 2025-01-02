import { Client } from '@notionhq/client'
import { DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints'

import { NotionDatabase } from '@/interfaces/notion'
import { HttpResponse } from '@/server/types'


export const getNotionDatabasesController = async (
  notion: Client
): Promise<HttpResponse<NotionDatabase[]>> => {
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

    return {
      data: formatNotionDatabases(response.results as DatabaseObjectResponse[]),
      status: 200,
    }
  } catch (error) {
    return {
      data: {} as NotionDatabase[],
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
