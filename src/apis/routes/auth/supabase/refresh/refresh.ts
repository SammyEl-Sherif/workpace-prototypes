import { createClient } from '@supabase/supabase-js'
import { NextApiRequest, NextApiResponse } from 'next'

/**
 * Refresh token endpoint for Supabase authentication
 * Refreshes the access token using the refresh token from cookies
 * Updates cookies with new tokens
 *
 * POST /api/auth/supabase/refresh
 */
export const refresh = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST')
      res.status(405).json({ message: 'Method not allowed' })
      return
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_WORKPACE_SUPABASE_URL
    // Use anon key for user token operations (same pattern as getSupabaseSession)
    // Trim whitespace from the key (common issue when copying from Supabase dashboard)
    const supabaseAnonKey = process.env.WORKPACE_SUPABASE_SERVICE_ROLE_KEY?.trim()

    if (!supabaseUrl || !supabaseAnonKey) {
      res.status(500).json({
        message: 'Refresh failed',
        error: 'Missing Supabase configuration',
      })
      return
    }

    // Create a client with anon key for user token refresh
    // We use anon key because we're refreshing user tokens, not performing admin operations
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Get refresh token from cookies
    let refreshToken = req.cookies['sb-refresh-token'] || null

    // Try to decode if it looks URL-encoded (contains %)
    if (refreshToken && refreshToken.includes('%')) {
      try {
        refreshToken = decodeURIComponent(refreshToken)
      } catch (e) {
        // If decoding fails, use original value
      }
    }

    if (!refreshToken) {
      res.status(401).json({
        message: 'Refresh failed',
        error: 'No refresh token found',
      })
      return
    }

    // Refresh the session
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    })

    if (error || !data.session) {
      // If refresh fails, clear cookies and return error
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

      res.status(401).json({
        message: 'Refresh failed',
        error: error?.message || 'Invalid refresh token',
      })
      return
    }

    // Set secure cookies with new tokens
    const isProduction = process.env.NODE_ENV === 'production'
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    }

    const { access_token, refresh_token } = data.session

    res.setHeader('Set-Cookie', [
      `sb-access-token=${access_token}; ${Object.entries(cookieOptions)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')}`,
      `sb-refresh-token=${refresh_token}; ${Object.entries(cookieOptions)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')}`,
    ])

    res.status(200).json({
      message: 'Token refreshed successfully',
      data: {
        user: data.user,
        session: {
          access_token,
          refresh_token,
        },
      },
    })
  } catch (error: any) {
    console.error('Error in Supabase refresh:', error)
    res.status(500).json({
      message: 'Refresh failed',
      error: error?.message || 'An unexpected error occurred',
    })
  }
}
