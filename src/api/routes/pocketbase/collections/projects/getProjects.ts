import { NextApiRequest, NextApiResponse } from 'next'

import { getProjectsController } from '@/api/controllers/pocketbase/collections'
import { withPocketbaseClient } from '@/server/utils'

export const getProjectsRoute = withPocketbaseClient<NextApiRequest, NextApiResponse>(
  async (_, response, pbClient) => {
    try {
      const { data, status } = await getProjectsController(pbClient)
      response.status(status).json(data)
    } catch (error: any) {
      response.status(error.statusCode || 500).json(error.message)
    }
  }
)
