import { NextApiRequest, NextApiResponse } from 'next'

import { createSupabaseServerClient } from '@/server/utils'

/**
 * Sign in endpoint for Supabase authentication
 * Supports both email and phone number signin
 *
 * POST /api/auth/supabase/signin
 * Body: { email?: string, phone?: string, password?: string, otp?: string }
 */
export const signin = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST')
      res.status(405).json({ message: 'Method not allowed' })
      return
    }

    const { email, phone, password, otp } = req.body

    // Validate that either email or phone is provided
    if (!email && !phone) {
      res.status(400).json({
        message: 'Bad Request',
        error: 'Either email or phone number is required',
      })
      return
    }

    const supabase = createSupabaseServerClient()

    let signInResponse

    if (phone) {
      if (otp) {
        // Verify OTP and sign in
        signInResponse = await supabase.auth.verifyOtp({
          phone,
          token: otp,
          type: 'sms',
        })
      } else {
        // Request OTP for phone signin
        signInResponse = await supabase.auth.signInWithOtp({
          phone,
        })
      }
    } else if (email) {
      if (otp) {
        // Verify OTP for email
        signInResponse = await supabase.auth.verifyOtp({
          email,
          token: otp,
          type: 'email',
        })
      } else if (password) {
        // Sign in with email and password
        signInResponse = await supabase.auth.signInWithPassword({
          email,
          password,
        })
      } else {
        // Request OTP for email (passwordless)
        signInResponse = await supabase.auth.signInWithOtp({
          email,
        })
      }
    } else {
      res.status(400).json({
        message: 'Bad Request',
        error: 'Invalid signin parameters',
      })
      return
    }

    if (signInResponse.error) {
      res.status(400).json({
        message: 'Signin failed',
        error: signInResponse.error.message,
      })
      return
    }

    // If OTP was requested (not verified), return success
    // Only return requiresVerification if:
    // 1. Phone was used (phone signin always uses OTP)
    // 2. Email was used WITHOUT password (passwordless email OTP flow)
    // Do NOT return requiresVerification for email/password signin
    if (phone && !otp) {
      // Phone signin always requires OTP
      res.status(200).json({
        message: 'OTP sent',
        data: {
          phone,
          requiresVerification: true,
        },
      })
      return
    }

    if (email && !password && !otp) {
      // Passwordless email OTP was requested
      res.status(200).json({
        message: 'OTP sent',
        data: {
          email,
          requiresVerification: true,
        },
      })
      return
    }

    // If we have a session, set cookies and return session
    if (signInResponse.data.session) {
      const { access_token, refresh_token } = signInResponse.data.session

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
        message: 'Signin successful',
        data: {
          user: signInResponse.data.user,
          session: {
            access_token,
            refresh_token,
          },
        },
      })
      return
    }

    res.status(200).json({
      message: 'Signin initiated',
      data: signInResponse.data,
    })
  } catch (error: any) {
    console.error('Error in Supabase signin:', error)
    res.status(500).json({
      message: 'Internal server error',
      error: error?.message || 'An unexpected error occurred',
    })
  }
}
