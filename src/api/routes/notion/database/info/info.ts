import { NextApiRequest, NextApiResponse } from 'next'

import { getNotionDatabaseInfoController } from '@/api/controllers'
import { withNotionClient } from '@/server/utils/withNotionClient'

export const getNotionDatabaseInfoRoute = withNotionClient<NextApiRequest, NextApiResponse>(
  async (request, response, notionClient) => {
    const { database_id } = request.body

    try {
      try {
        const data = await getNotionDatabaseInfoController(notionClient, database_id)
        response.status(200).json(data)
      } catch (err: any) {
        response.status(err.statusCode || 500).json(err.message)
      }
      response.status(200)
    } catch (error) {
      response.status(500)
    }
  }
)
