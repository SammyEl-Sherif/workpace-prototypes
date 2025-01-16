import { NextApiRequest, NextApiResponse } from 'next'

import { withPocketbaseClient } from '@/server/utils'
import { getProjectsController } from '@/api/controllers/pocketbase/collections'

export const getProjectsRoute = withPocketbaseClient<NextApiRequest, NextApiResponse>(
  async (_, response, pbClient) => {
    try {
      try {
        const data = await getProjectsController(pbClient)
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
