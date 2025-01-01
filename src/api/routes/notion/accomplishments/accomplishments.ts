import { NextApiRequest, NextApiResponse } from 'next'

import { getNotionAccomplishmentsController } from '@/api/controllers'
import { withNotionClient } from '@/server/utils/withNotionClient'

export const getNotionAccomplishmentsRoute = withNotionClient<NextApiRequest, NextApiResponse>(
  async (request, response, notionClient) => {
    const {} = request.body

    try {
      try {
        const data = await getNotionAccomplishmentsController(notionClient)
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
