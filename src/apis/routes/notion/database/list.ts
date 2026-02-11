import { NextApiRequest, NextApiResponse } from 'next'
import { getNotionDatabasesController } from '@/apis/controllers/notion/databases/databases'
import { requireApiAuth, withNotionClient } from '@/server/utils'

export const getNotionDatabasesRoute = requireApiAuth(
  withNotionClient<NextApiRequest, NextApiResponse>(async (request, response, notionClient) => {
    try {
      const { data, status } = await getNotionDatabasesController(notionClient)
      response.status(status).json(data)
    } catch (error: any) {
      response
        .status(error.statusCode || 500)
        .json({ message: error.message || 'Failed to fetch databases' })
    }
  })
)
