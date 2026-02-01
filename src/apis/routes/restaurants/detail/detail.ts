import { NextApiRequest, NextApiResponse } from 'next'

import { getRestaurantByIdController } from '@/apis/controllers/restaurants'

/**
 * GET /api/restaurants/[id]
 * Public route - no authentication required
 *
 * URL params:
 * - id: string - restaurant ID
 */
export const getRestaurantByIdRoute = async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  const { id } = request.query

  if (!id || Array.isArray(id)) {
    response.status(400).json({ error: 'Invalid restaurant ID' })
    return
  }

  try {
    const { data, status } = await getRestaurantByIdController(id)

    if (status === 404) {
      response.status(404).json({ error: 'Restaurant not found' })
      return
    }

    response.status(status).json(data)
  } catch (error) {
    console.error('[getRestaurantByIdRoute] Error:', error)
    response.status(500).json({ error: 'Internal server error' })
  }
}
