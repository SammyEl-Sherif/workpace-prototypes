import { NextApiRequest, NextApiResponse } from 'next'

import { getAppsController } from '@/apis/controllers/apps'
import { requireApiAuth } from '@/server/utils'

/**
 * GET /api/apps
 * Protected route - requires authentication
 *
 * Returns all apps
 */
export const getAppsRoute = requireApiAuth(
  async (_request: NextApiRequest, response: NextApiResponse): Promise<void> => {
    try {
      const { data, status } = await getAppsController()
      response.status(status).json(data)
    } catch (error) {
      console.error('[getAppsRoute] Error:', error)
      response.status(500).json({ error: 'Internal server error' })
    }
  }
)
