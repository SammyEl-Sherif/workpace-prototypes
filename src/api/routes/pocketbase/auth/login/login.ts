import { NextApiRequest, NextApiResponse } from 'next'

import { loginUserController } from '@/api/controllers/pocketbase/auth'
import { withPocketbaseClient } from '@/server/utils'

export const loginUserRoute = withPocketbaseClient<NextApiRequest, NextApiResponse>(
  async (request, response, pbClient) => {
    try {
      const { email, password } = request.body
      const { data, status } = await loginUserController(pbClient, { email, password })

      response.setHeader('Set-Cookie', pbClient.authStore.exportToCookie({ httpOnly: false }))
      response.status(status).json(data.record)
    } catch (error: any) {
      response.status(error.statusCode || 500).json(error.message)
    }
  }
)
