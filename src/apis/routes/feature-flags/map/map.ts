import { NextApiRequest, NextApiResponse } from 'next'

import { getFeatureFlagMapController } from '@/apis/controllers/feature-flags'

/**
 * GET /api/feature-flags/map
 * Public route - no authentication required
 * Returns a key->boolean map of all feature flags (for client-side consumption).
 * This endpoint is intentionally public so that unauthenticated users
 * can also receive flag states (e.g. maintenance mode overlay on landing page).
 */
export const getFeatureFlagMapRoute = async (
  _request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  try {
    const { data, status } = await getFeatureFlagMapController()
    response.status(status).json(data)
  } catch (error) {
    console.error('[getFeatureFlagMapRoute] Error:', error)
    response.status(500).json({ error: 'Internal server error' })
  }
}
