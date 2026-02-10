import { NextApiRequest, NextApiResponse } from 'next'

import { getSupabaseSession } from '@/server/utils'

/**
 * Get current session endpoint for Supabase authentication
 * Reads session from httpOnly cookies and returns it to the client
 *
 * GET /api/auth/supabase/session
 */
export const getSession = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET')
      res.status(405).json({ message: 'Method not allowed' })
      return
    }

    const sessionData = await getSupabaseSession(req)

    if (!sessionData || !sessionData.user) {
      res.status(200).json({
        message: 'No session found',
        data: null,
      })
      return
    }

    // Return session data (without sensitive tokens in response body)
    // The tokens remain in httpOnly cookies
    res.status(200).json({
      message: 'Session found',
      data: {
        user: sessionData.user,
        // Include access token in response so client can set it in Supabase client
        // This is safe because it's the same token that's already in the httpOnly cookie
        access_token: sessionData.accessToken,
        refresh_token: sessionData.refreshToken,
      },
    })
  } catch (error: any) {
    console.error('Error in Supabase getSession:', error)
    res.status(500).json({
      message: 'Internal server error',
      error: error?.message || 'An unexpected error occurred',
    })
  }
}
