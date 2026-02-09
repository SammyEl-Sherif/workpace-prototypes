import { NextApiRequest, NextApiResponse } from 'next'

import { getFeatureFlagsController, createFeatureFlagController } from '@/apis/controllers/feature-flags'
import { withApiAuth } from '@/server/utils'

/**
 * GET /api/feature-flags
 * Protected route - requires authentication
 * Returns all feature flags (for admin interface)
 */
export const getFeatureFlagsRoute = withApiAuth(
  async (_request: NextApiRequest, response: NextApiResponse, session): Promise<void> => {
    try {
      const { data, status } = await getFeatureFlagsController()
      response.status(status).json(data)
    } catch (error) {
      console.error('[getFeatureFlagsRoute] Error:', error)
      response.status(500).json({ error: 'Internal server error' })
    }
  }
)

/**
 * POST /api/feature-flags
 * Protected route - requires authentication
 * Creates a new feature flag
 */
export const createFeatureFlagRoute = withApiAuth(
  async (request: NextApiRequest, response: NextApiResponse, session): Promise<void> => {
    try {
      const { key, name, description, enabled } = request.body
      const { data, status } = await createFeatureFlagController(
        { key, name, description, enabled },
        session.sub
      )

      if (status === 400) {
        response.status(400).json({ error: 'Invalid input. Key must be lowercase with hyphens/underscores only.' })
        return
      }

      if (status === 409) {
        response.status(409).json({ error: 'A feature flag with this key already exists.' })
        return
      }

      response.status(status).json(data)
    } catch (error) {
      console.error('[createFeatureFlagRoute] Error:', error)
      response.status(500).json({ error: 'Internal server error' })
    }
  }
)
