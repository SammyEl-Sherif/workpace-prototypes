import { Client } from '@notionhq/client'
import { DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints'

import { HttpResponse } from '@/server/types'

export const getNotionDatabaseInfoController = async (
  client: Client
): Promise<HttpResponse<DatabaseObjectResponse>> => {
  try {
    const databaseId = process.env.NOTION_DB_ID || ''
    const database = await client.databases.retrieve({ database_id: databaseId })

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
