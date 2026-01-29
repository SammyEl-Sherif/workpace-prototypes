import { NextApiRequest, NextApiResponse } from 'next'

import { getPrototypesController } from '@/apis/controllers'

export const getPrototypesRoute = async (request: NextApiRequest, response: NextApiResponse) => {
  try {
    const { data, status } = await getPrototypesController()
    response.status(status).json(data)
  } catch (error: any) {
    response.status(error.statusCode || 500).json({ error: error.message })
  }
}
