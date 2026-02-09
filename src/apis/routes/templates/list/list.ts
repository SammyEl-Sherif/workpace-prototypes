import { NextApiRequest, NextApiResponse } from 'next'

import { getTemplatesController } from '@/apis/controllers/templates'

/**
 * GET /api/templates
 * Public route - no authentication required
 *
 * Returns all published notion templates
 */
export const getTemplatesRoute = async (
  _request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  try {
    const { data, status } = await getTemplatesController()
    response.status(status).json(data)
  } catch (error) {
    console.error('[getTemplatesRoute] Error:', error)
    response.status(500).json({ error: 'Internal server error' })
  }
}
