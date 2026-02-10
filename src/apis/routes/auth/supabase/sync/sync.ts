import { NextApiRequest, NextApiResponse } from 'next'

/**
 * Sync session cookies endpoint
 * Updates httpOnly cookies with tokens from Supabase client session
 * This is called when Supabase client refreshes tokens automatically
 *
 * POST /api/auth/supabase/sync
 * Body: { access_token: string, refresh_token: string }
 */
export const sync = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST')
      res.status(405).json({ message: 'Method not allowed' })
      return
    }

    const { access_token, refresh_token } = req.body

    if (!access_token || !refresh_token) {
      res.status(400).json({
        message: 'Bad Request',
        error: 'access_token and refresh_token are required',
      })
      return
    }

    // Set secure cookies with provided tokens
    const isProduction = process.env.NODE_ENV === 'production'
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    }

    res.setHeader('Set-Cookie', [
      `sb-access-token=${access_token}; ${Object.entries(cookieOptions)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')}`,
      `sb-refresh-token=${refresh_token}; ${Object.entries(cookieOptions)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')}`,
    ])

    res.status(200).json({
      message: 'Session synced successfully',
    })
  } catch (error: any) {
    console.error('Error in Supabase sync:', error)
    res.status(500).json({
      message: 'Internal server error',
      error: error?.message || 'An unexpected error occurred',
    })
  }
}
