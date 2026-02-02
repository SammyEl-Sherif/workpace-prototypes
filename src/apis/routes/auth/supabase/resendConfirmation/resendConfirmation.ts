import { NextApiRequest, NextApiResponse } from 'next'

import { createSupabaseServerClient } from '@/server/utils'

/**
 * Resend confirmation email endpoint for Supabase authentication
 * Resends the email confirmation link to the user
 *
 * POST /api/auth/supabase/resend-confirmation
 * Body: { email: string }
 */
export const resendConfirmation = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST')
      res.status(405).json({ message: 'Method not allowed' })
      return
    }

    const { email } = req.body

    if (!email) {
      res.status(400).json({
        message: 'Bad Request',
        error: 'Email is required',
      })
      return
    }

    const supabase = createSupabaseServerClient()

    // Resend confirmation email using Supabase's resend method
    // This works for unconfirmed users who signed up with email/password
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/signin`,
      },
    })

    if (error) {
      // If resend fails, try alternative: use signInWithOtp which can also send confirmation
      // for unconfirmed users
      const fallbackResponse = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false, // Don't create new user, just resend
          emailRedirectTo: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/signin`,
        },
      })

      if (fallbackResponse.error) {
        res.status(400).json({
          message: 'Failed to resend confirmation email',
          error: fallbackResponse.error.message || error.message,
        })
        return
      }

      res.status(200).json({
        message: 'Confirmation email resent successfully',
        data: {
          email,
        },
      })
      return
    }

    res.status(200).json({
      message: 'Confirmation email resent successfully',
      data: {
        email,
      },
    })
  } catch (error: any) {
    console.error('Error in resend confirmation:', error)
    res.status(500).json({
      message: 'Internal server error',
      error: error?.message || 'An unexpected error occurred',
    })
  }
}
