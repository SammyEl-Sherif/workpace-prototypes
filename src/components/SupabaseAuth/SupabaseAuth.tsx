import { signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, FormEvent, useState } from 'react'

import { Button, Card, InputField, Text } from '@workpace/design-system'

import { Routes } from '@/interfaces/routes'
import Logo from '@/public/proto-astrolabe-1.png'
import { getSupabaseClient } from '@/utils/supabase/client'

import styles from './SupabaseAuth.module.scss'

type AuthMode = 'signin' | 'signup'

type SupabaseAuthProps = {
  defaultMode?: AuthMode
}

const SupabaseAuth: FC<SupabaseAuthProps> = ({ defaultMode = 'signin' }) => {
  const router = useRouter()
  const [mode, setMode] = useState<AuthMode>(defaultMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [requiresOtp, setRequiresOtp] = useState(false)
  const [requiresEmailConfirmation, setRequiresEmailConfirmation] = useState(false)
  const [isResending, setIsResending] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsLoading(true)

    try {
      if (mode === 'signup') {
        // Sign up
        const response = await fetch('/api/auth/supabase/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.error || 'Signup failed')
          setIsLoading(false)
          return
        }

        if (data.data?.requiresVerification) {
          setRequiresOtp(true)
          setRequiresEmailConfirmation(false)
          setSuccess('Verification code sent to your email')
        } else if (data.data?.requiresEmailConfirmation) {
          setRequiresEmailConfirmation(true)
          setRequiresOtp(false)
          setSuccess('Please check your email to confirm your account')
        } else if (data.data?.session) {
          // Successfully signed up and logged in
          // Set session in Supabase client
          const supabase = getSupabaseClient()
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token: data.data.session.access_token,
            refresh_token: data.data.session.refresh_token,
          })

          if (sessionError) {
            console.error('Error setting Supabase session:', sessionError)
          }

          // Create NextAuth session using Supabase credentials provider
          // This will create a NextAuth session that persists
          const result = await signIn('supabase', {
            redirect: false,
            email: email,
            password: password,
          })

          const callbackUrl = new URLSearchParams(window.location.search).get('callbackUrl')

          // Reload the page to ensure all session state is properly initialized
          // This ensures NextAuth picks up the new session
          if (result?.ok || sessionData?.session) {
            // Small delay to ensure cookies are set
            setTimeout(() => {
              window.location.href = callbackUrl || Routes.HOME
            }, 100)
          } else {
            // If NextAuth signin fails, still redirect (we have Supabase session in cookies)
            router.push(callbackUrl || Routes.HOME)
          }
        }
      } else {
        // Sign in
        if (requiresOtp) {
          // Verify OTP
          const response = await fetch('/api/auth/supabase/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email,
              token: otp,
              type: 'email',
            }),
          })

          const data = await response.json()

          if (!response.ok) {
            setError(data.error || 'Verification failed')
            setIsLoading(false)
            return
          }

          if (data.data?.session) {
            // Successfully verified and logged in
            // Set session in Supabase client
            const supabase = getSupabaseClient()
            await supabase.auth.setSession({
              access_token: data.data.session.access_token,
              refresh_token: data.data.session.refresh_token,
            })

            // Create NextAuth session using Supabase credentials provider
            // For OTP verification, we need to get the user info and create a session
            // Since we already have the session, we'll use NextAuth's signIn with the credentials
            // Note: For OTP flow, we can't use password, so we'll skip NextAuth for now
            // The Supabase session in cookies should be enough

            const callbackUrl = new URLSearchParams(window.location.search).get('callbackUrl')
            // Force a page reload to ensure session is picked up
            window.location.href = callbackUrl || Routes.HOME
          }
        } else {
          // Request sign in with email and password
          const response = await fetch('/api/auth/supabase/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          })

          const data = await response.json()

          if (!response.ok) {
            setError(data.error || 'Signin failed')
            setIsLoading(false)
            return
          }

          if (data.data?.requiresVerification) {
            // Only show OTP UI if verification is explicitly required
            // This should not happen for email/password signin
            setRequiresOtp(true)
            setSuccess('Verification code sent to your email')
          } else if (data.data?.session) {
            // Successfully signed in
            // Set session in Supabase client
            const supabase = getSupabaseClient()
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token: data.data.session.access_token,
              refresh_token: data.data.session.refresh_token,
            })

            if (sessionError) {
              console.error('Error setting Supabase session:', sessionError)
            }

            // Create NextAuth session using Supabase credentials provider
            // This will create a NextAuth session that persists
            const result = await signIn('supabase', {
              redirect: false,
              email: email,
              password: password,
            })

            const callbackUrl = new URLSearchParams(window.location.search).get('callbackUrl')

            // Reload the page to ensure all session state is properly initialized
            // This ensures NextAuth picks up the new session
            if (result?.ok || sessionData?.session) {
              // Small delay to ensure cookies are set
              setTimeout(() => {
                window.location.href = callbackUrl || Routes.HOME
              }, 100)
            } else {
              // If NextAuth signin fails, still redirect (we have Supabase session in cookies)
              router.push(callbackUrl || Routes.HOME)
            }
          } else {
            // Signin completed but no session - might need email confirmation
            setError('Please check your email to confirm your account before signing in')
          }
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendConfirmation = async () => {
    if (!email) {
      setError('Email is required to resend confirmation')
      return
    }

    setIsResending(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/auth/supabase/resend-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to resend confirmation email')
      } else {
        setSuccess('Confirmation email resent! Please check your inbox.')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsResending(false)
    }
  }

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin')
    setError(null)
    setSuccess(null)
    setRequiresOtp(false)
    setRequiresEmailConfirmation(false)
    setOtp('')
  }

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.brandSection}>
          <Link href={Routes.HOME} className={styles.brandLink}>
            <Image src={Logo} alt="WorkPace Logo" className={styles.logo} />
          </Link>
          <Text variant="headline-lg" className={styles.brandTitle}>
            WorkPace
          </Text>
          <Text variant="body-md" className={styles.brandSubtitle}>
            Log in to continue to WorkPace.
          </Text>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Email Input */}
          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            errorText={error ? error : undefined}
          />

          {/* Password Input (only for signup or signin without OTP) */}
          {(mode === 'signup' || !requiresOtp) && (
            <InputField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={mode === 'signup' || !requiresOtp}
              disabled={isLoading}
            />
          )}

          {/* OTP Input */}
          {requiresOtp && (
            <InputField
              label="Verification Code"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit code"
              required
              disabled={isLoading}
              helperText="Enter the code sent to your email"
            />
          )}

          {/* Success Message */}
          {success && (
            <div className={styles.successMessage}>
              <Text variant="body-md">{success}</Text>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className={styles.errorMessage}>
              <Text variant="body-md">{error}</Text>
            </div>
          )}

          {/* Resend Confirmation Email Button */}
          {requiresEmailConfirmation && (
            <div className={styles.resendSection}>
              <Text variant="body-sm" className={styles.resendText}>
                Didn&apos;t receive the email?
              </Text>
              <Button
                type="button"
                variant="default-secondary"
                onClick={handleResendConfirmation}
                disabled={isResending || isLoading}
                className={styles.resendButton}
              >
                {isResending ? 'Sending...' : 'Resend confirmation email'}
              </Button>
            </div>
          )}

          {/* Submit Button - Hide if email confirmation is required */}
          {!requiresEmailConfirmation && (
            <Button type="submit" variant="brand-secondary" disabled={isLoading}>
              {isLoading
                ? 'Loading...'
                : requiresOtp
                ? 'Verify'
                : mode === 'signin'
                ? 'Sign In'
                : 'Sign Up'}
            </Button>
          )}
        </form>

        {/* Toggle between Sign In and Sign Up */}
        <div className={styles.footer}>
          <Text variant="body-md">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button type="button" onClick={toggleMode} className={styles.linkButton}>
              {mode === 'signin' ? 'Sign Up' : 'Sign In'}
            </button>
          </Text>
        </div>
      </Card>
    </div>
  )
}

export default SupabaseAuth
