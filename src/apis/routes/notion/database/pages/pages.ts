import { NextApiRequest, NextApiResponse } from 'next'

import { getNotionPagesController } from '@/apis/controllers'
import { requireApiAuth, withNotionClient } from '@/server/utils'

export const getNotionDatabasePagesRoute = requireApiAuth(
  withNotionClient<NextApiRequest, NextApiResponse>(async (request, response, notionClient) => {
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
  })
)
