import { Client } from '@notionhq/client'
import { DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints'

import { HttpResponse } from '@/server/types'

export const getNotionDatabaseInfoController = async (
  client: Client,
  database_id: string = process.env.NOTION_DEFAULT_DB_ID || ''
): Promise<HttpResponse<DatabaseObjectResponse>> => {
  try {
    const database = await client.databases.retrieve({ database_id })

    return {
      data: database as DatabaseObjectResponse,
      status: 200,
    }
  } catch (error) {
    return {
      data: {} as DatabaseObjectResponse,
      status: 500,
    }
  }
}
