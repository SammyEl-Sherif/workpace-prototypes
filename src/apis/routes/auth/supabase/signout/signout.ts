import { NextApiRequest, NextApiResponse } from 'next'

import { createSupabaseServerClient } from '@/server/utils'

/**
 * Sign out endpoint for Supabase authentication
 * Clears the session and cookies
 *
 * POST /api/auth/supabase/signout
 */
export const signout = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST')
      res.status(405).json({ message: 'Method not allowed' })
      return
    }

    const supabase = createSupabaseServerClient()

    // Get access token from cookies or header
    const accessToken =
      req.cookies['sb-access-token'] || req.headers.authorization?.replace('Bearer ', '')

    if (accessToken) {
      // Sign out the user
      await supabase.auth.signOut()
    }

    // Clear cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 0,
      path: '/',
    }

    res.setHeader('Set-Cookie', [
      `sb-access-token=; ${Object.entries(cookieOptions)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')}`,
      `sb-refresh-token=; ${Object.entries(cookieOptions)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')}`,
    ])

    res.status(200).json({
      message: 'Signout successful',
    })
  } catch (error: any) {
    console.error('Error in Supabase signout:', error)
    // Still clear cookies even on error
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 0,
      path: '/',
    }

    res.setHeader('Set-Cookie', [
      `sb-access-token=; ${Object.entries(cookieOptions)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')}`,
      `sb-refresh-token=; ${Object.entries(cookieOptions)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')}`,
    ])

    res.status(200).json({
      message: 'Signout completed',
      warning: error?.message,
    })
  }
}
