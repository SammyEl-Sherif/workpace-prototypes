import { NextApiRequest, NextApiResponse } from 'next'

import { getAgentsController } from '@/apis/controllers/agents'

/**
 * GET /api/agents
 * Public route - no authentication required
 *
 * Returns all published agents
 */
export const getAgentsRoute = async (
  _request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  try {
    const { data, status } = await getAgentsController()
    response.status(status).json(data)
  } catch (error) {
    console.error('[getAgentsRoute] Error:', error)
    response.status(500).json({ error: 'Internal server error' })
  }
}
