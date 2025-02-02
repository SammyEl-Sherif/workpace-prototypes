import { NextApiRequest, NextApiResponse } from 'next'

import { getNotionPagesController } from '@/api/controllers'
import { withNotionClient } from '@/server/utils/withNotionClient'

export const getNotionDatabasePagesRoute = withNotionClient<NextApiRequest, NextApiResponse>(
  async (request, response, notionClient) => {
    const { database_id, filters } = request.body

    try {
      try {
        const { data, status } = await getNotionPagesController(notionClient, database_id, filters)
        response.status(status).json(data)
      } catch (err: any) {
        response.status(err.statusCode || 500).json(err.message)
      }
      response.status(200)
    } catch (error) {
      response.status(500)
    }
  }
)
