import { NextApiRequest, NextApiResponse } from 'next'

import { createSupabaseServerClient } from '@/server/utils'

/**
 * Sign up endpoint for Supabase authentication
 * Supports both email and phone number signup
 *
 * POST /api/auth/supabase/signup
 * Body: { email?: string, phone?: string, password?: string }
 */
export const signup = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST')
      res.status(405).json({ message: 'Method not allowed' })
      return
    }

    const { email, phone, password } = req.body

    // Validate that either email or phone is provided
    if (!email && !phone) {
      res.status(400).json({
        message: 'Bad Request',
        error: 'Either email or phone number is required',
      })
      return
    }

    // If email is provided, password is required
    if (email && !password) {
      res.status(400).json({
        message: 'Bad Request',
        error: 'Password is required when signing up with email',
      })
      return
    }

    const supabase = createSupabaseServerClient()

    let signUpResponse

    if (phone) {
      // Sign up with phone number (passwordless)
      signUpResponse = await supabase.auth.signInWithOtp({
        phone,
        options: {
          shouldCreateUser: true,
        },
      })
    } else if (email && password) {
      // Sign up with email and password
      signUpResponse = await supabase.auth.signUp({
        email,
        password,
      })
    } else {
      res.status(400).json({
        message: 'Bad Request',
        error: 'Invalid signup parameters',
      })
      return
    }

    if (signUpResponse.error) {
      res.status(400).json({
        message: 'Signup failed',
        error: signUpResponse.error.message,
      })
      return
    }

    // For phone signup, we send OTP - user needs to verify
    if (phone) {
      res.status(200).json({
        message: 'OTP sent to phone number',
        data: {
          phone,
          requiresVerification: true,
        },
      })
      return
    }

    // For email signup, check if email confirmation is required
    if (email && signUpResponse.data.user && !signUpResponse.data.session) {
      res.status(200).json({
        message: 'Signup successful. Please check your email to confirm your account.',
        data: {
          email,
          requiresEmailConfirmation: true,
        },
      })
      return
    }

    // If we have a session, set cookies and return session
    if (signUpResponse.data.session) {
      const { access_token, refresh_token } = signUpResponse.data.session

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
        message: 'Signup successful',
        data: {
          user: signUpResponse.data.user,
          session: {
            access_token,
            refresh_token,
          },
        },
      })
      return
    }

    res.status(200).json({
      message: 'Signup initiated',
      data: signUpResponse.data,
    })
  } catch (error: any) {
    console.error('Error in Supabase signup:', error)
    res.status(500).json({
      message: 'Internal server error',
      error: error?.message || 'An unexpected error occurred',
    })
  }
}
