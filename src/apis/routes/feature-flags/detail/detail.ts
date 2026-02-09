import { NextApiRequest, NextApiResponse } from 'next'

import {
  updateFeatureFlagController,
  toggleFeatureFlagController,
  deleteFeatureFlagController,
} from '@/apis/controllers/feature-flags'
import { withApiAuth } from '@/server/utils'

/**
 * PUT /api/feature-flags/[id]
 * Protected route - requires authentication
 * Updates a feature flag
 */
export const updateFeatureFlagRoute = withApiAuth(
  async (request: NextApiRequest, response: NextApiResponse, session): Promise<void> => {
    try {
      const { id } = request.query
      const { key, name, description, enabled } = request.body
      const { data, status } = await updateFeatureFlagController(
        id as string,
        { key, name, description, enabled },
        session.sub
      )

      if (status === 400) {
        response.status(400).json({ error: 'Invalid input. Key must be lowercase with hyphens/underscores only.' })
        return
      }

      if (status === 404) {
        response.status(404).json({ error: 'Feature flag not found.' })
        return
      }

      if (status === 409) {
        response.status(409).json({ error: 'A feature flag with this key already exists.' })
        return
      }

      response.status(status).json(data)
    } catch (error) {
      console.error('[updateFeatureFlagRoute] Error:', error)
      response.status(500).json({ error: 'Internal server error' })
    }
  }
)

/**
 * PATCH /api/feature-flags/[id]
 * Protected route - requires authentication
 * Toggles a feature flag's enabled state
 */
export const toggleFeatureFlagRoute = withApiAuth(
  async (request: NextApiRequest, response: NextApiResponse, session): Promise<void> => {
    try {
      const { id } = request.query
      const { data, status } = await toggleFeatureFlagController(id as string, session.sub)

      if (status === 404) {
        response.status(404).json({ error: 'Feature flag not found.' })
        return
      }

      response.status(status).json(data)
    } catch (error) {
      console.error('[toggleFeatureFlagRoute] Error:', error)
      response.status(500).json({ error: 'Internal server error' })
    }
  }
)

/**
 * DELETE /api/feature-flags/[id]
 * Protected route - requires authentication
 * Deletes a feature flag
 */
export const deleteFeatureFlagRoute = withApiAuth(
  async (request: NextApiRequest, response: NextApiResponse, session): Promise<void> => {
    try {
      const { id } = request.query
      const { data, status } = await deleteFeatureFlagController(id as string)

      if (status === 404) {
        response.status(404).json({ error: 'Feature flag not found.' })
        return
      }

      response.status(status).json(data)
    } catch (error) {
      console.error('[deleteFeatureFlagRoute] Error:', error)
      response.status(500).json({ error: 'Internal server error' })
    }
  }
)
