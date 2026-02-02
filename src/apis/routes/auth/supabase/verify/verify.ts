import { NextApiRequest, NextApiResponse } from 'next'

import { createSupabaseServerClient } from '@/server/utils'

/**
 * Verify OTP endpoint for Supabase authentication
 * Used to verify phone or email OTP codes
 *
 * POST /api/auth/supabase/verify
 * Body: { phone?: string, email?: string, token: string, type: 'sms' | 'email' }
 */
export const verify = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST')
      res.status(405).json({ message: 'Method not allowed' })
      return
    }

    const { phone, email, token, type = 'sms' } = req.body

    // Validate that either email or phone is provided
    if (!email && !phone) {
      res.status(400).json({
        message: 'Bad Request',
        error: 'Either email or phone number is required',
      })
      return
    }

    if (!token) {
      res.status(400).json({
        message: 'Bad Request',
        error: 'OTP token is required',
      })
      return
    }

    const supabase = createSupabaseServerClient()

    const verifyResponse = await supabase.auth.verifyOtp({
      phone,
      email,
      token,
      type: type as 'sms' | 'email',
    })

    if (verifyResponse.error) {
      res.status(400).json({
        message: 'Verification failed',
        error: verifyResponse.error.message,
      })
      return
    }

    // If we have a session, set cookies and return session
    if (verifyResponse.data.session) {
      const { access_token, refresh_token } = verifyResponse.data.session

      // Set secure cookies
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
        message: 'Verification successful',
        data: {
          user: verifyResponse.data.user,
          session: {
            access_token,
            refresh_token,
          },
        },
      })
      return
    }

    res.status(200).json({
      message: 'Verification successful',
      data: verifyResponse.data,
    })
  } catch (error: any) {
    console.error('Error in Supabase verify:', error)
    res.status(500).json({
      message: 'Internal server error',
      error: error?.message || 'An unexpected error occurred',
    })
  }
}
