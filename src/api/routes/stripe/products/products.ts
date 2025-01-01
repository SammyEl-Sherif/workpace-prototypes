import { NextApiRequest, NextApiResponse } from 'next'

import { getStripeProductsController } from '@/api/controllers/stripe/products'
import { withApiClient } from '@/server/utils/withApiClient'

export const getStripeProductsRoute = withApiClient<NextApiRequest, NextApiResponse>(
  async (request, response, httpClient) => {
    const {} = request.body

    try {
      if (request.method === 'GET') {
        try {
          const data = await getStripeProductsController(httpClient, { limit: 2 }) // the controller
          response.status(200).json(data)
        } catch (err: any) {
          response.status(err.statusCode || 500).json(err.message)
        }
      } else {
        response.setHeader('Allow', 'POST')
        response.status(405).end('Method Not Allowed')
      }

      response.status(200)
    } catch (error) {
      response.status(500)
    }
  }
)
