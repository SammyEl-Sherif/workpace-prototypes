import { NextApiRequest, NextApiResponse } from 'next'

import { getMembersController } from '@/apis/controllers/members'

/**
 * GET /api/members
 * Public route - no authentication required
 *
 * Returns all community members from Notion
 */
export const getMembersRoute = async (
  _request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  try {
    const { data, status } = await getMembersController()
    response.status(status).json(data)
  } catch (error) {
    console.error('[getMembersRoute] Error:', error)
    response.status(500).json({ error: 'Internal server error' })
  }
}
