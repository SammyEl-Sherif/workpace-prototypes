import { NextApiRequest, NextApiResponse } from 'next'

import { getNotionDatabaseInfoController } from '@/api/controllers'
import { withNotionClient } from '@/server/utils'

export const getNotionDatabaseInfoRoute = withNotionClient<NextApiRequest, NextApiResponse>(
  async (request, response, notionClient) => {
    const { database_id } = request.body

    try {
      try {
        const { data, status } = await getNotionDatabaseInfoController(notionClient, database_id)
        response.status(status).json(data)
      } catch (error: any) {
        response.status(error.statusCode || 500).json(error.message)
      }
      response.status(200)
    } catch (error) {
      response.status(500)
    }
  }
)
