import { NextApiRequest, NextApiResponse } from 'next'

import { getPrototypesController } from '@/apis/controllers/prototypes'
import { requireApiAuth } from '@/server/utils'

/**
 * GET /api/prototypes
 * Protected route - requires authentication
 *
 * Returns all prototypes
 */
export const getPrototypesRoute = requireApiAuth(
  async (_request: NextApiRequest, response: NextApiResponse): Promise<void> => {
    try {
      const { data, status } = await getPrototypesController()
      response.status(status).json(data)
    } catch (error) {
      console.error('[getPrototypesRoute] Error:', error)
      response.status(500).json({ error: 'Internal server error' })
    }
  }
)
