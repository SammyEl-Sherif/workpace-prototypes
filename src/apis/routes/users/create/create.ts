import { NextApiRequest, NextApiResponse } from 'next'

import { createUserController, CreateUserInput } from '@/apis/controllers/users'
import { requireApiAuth } from '@/server/utils'

/**
 * POST /api/users
 * Protected route - requires authentication
 *
 * Request body:
 * - auth0_user_id: string (required)
 * - email: string (optional)
 * - email_verified: boolean (optional)
 * - name: string (optional)
 * - given_name: string (optional)
 * - family_name: string (optional)
 * - picture_url: string (optional)
 * - is_active: boolean (optional)
 * - blocked: boolean (optional)
 * - last_login_at: string (optional)
 * - app_metadata: object (optional)
 * - user_metadata: object (optional)
 */
export const createUserRoute = requireApiAuth(
  async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {
    const {
      auth0_user_id,
      email,
      email_verified,
      name,
      given_name,
      family_name,
      picture_url,
      is_active,
      blocked,
      last_login_at,
      app_metadata,
      user_metadata,
    } = request.body as CreateUserInput

    try {
      const result = await createUserController({
        auth0_user_id,
        email,
        email_verified,
        name,
        given_name,
        family_name,
        picture_url,
        is_active,
        blocked,
        last_login_at,
        app_metadata,
        user_metadata,
      })

      response.status(result.status).json(result.data)
    } catch (error) {
      console.error('[createUserRoute] Error:', error)
      response.status(500).json({ error: 'Internal server error' })
    }
  }
)
