import { useEffect, useState, useRef } from 'react'

import { getSupabaseClient } from '@/utils/supabase/client'

type SupabaseSession = {
  user: {
    id: string
    email?: string
    phone?: string
    user_metadata?: {
      name?: string
      email?: string
    }
  } | null
  session: {
    access_token: string
    refresh_token: string
  } | null
}

/**
 * Helper function to update cookies when session changes
 * This ensures cookies stay in sync with Supabase client session
 */
const updateSessionCookies = async (accessToken: string, refreshToken: string) => {
  try {
    // Call sync endpoint to update httpOnly cookies
    const response = await fetch('/api/auth/supabase/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important: include cookies in request
      body: JSON.stringify({
        access_token: accessToken,
        refresh_token: refreshToken,
      }),
    })

    if (!response.ok) {
      console.warn('Failed to update session cookies')
    }
  } catch (error) {
    console.warn('Error updating session cookies:', error)
  }
}

export const useSupabaseSession = () => {
  const [session, setSession] = useState<SupabaseSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const isInitialMount = useRef(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        // On initial mount, get session from server (reads httpOnly cookies)
        if (isInitialMount.current) {
          isInitialMount.current = false

          try {
            const response = await fetch('/api/auth/supabase/session', {
              method: 'GET',
              credentials: 'include', // Important: include cookies in request
            })

            if (response.ok) {
              const data = await response.json()

              if (
                data.data &&
                data.data.user &&
                data.data.access_token &&
                data.data.refresh_token
              ) {
                // Set session in Supabase client
                const supabase = getSupabaseClient()
                const { error: setSessionError } = await supabase.auth.setSession({
                  access_token: data.data.access_token,
                  refresh_token: data.data.refresh_token,
                })

                if (setSessionError) {
                  console.warn('Failed to set session in Supabase client:', setSessionError)
                } else {
                  // Session set successfully
                  setSession({
                    user: data.data.user,
                    session: {
                      access_token: data.data.access_token,
                      refresh_token: data.data.refresh_token,
                    },
                  })
                  setIsLoading(false)
                  return
                }
              }
            }
          } catch (error) {
            console.warn('Failed to get session from server:', error)
            // Fall through to try Supabase client directly
          }
        }

        // Fallback: try to get session from Supabase client
        // (might work if session was persisted in localStorage from previous visit)
        const supabase = getSupabaseClient()
        const {
          data: { session: currentSession },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error('Error getting Supabase session:', error)
          setSession(null)
          setIsLoading(false)
          return
        }

        if (currentSession) {
          setSession({
            user: currentSession.user,
            session: {
              access_token: currentSession.access_token,
              refresh_token: currentSession.refresh_token,
            },
          })
          // Update cookies to ensure they're in sync
          await updateSessionCookies(currentSession.access_token, currentSession.refresh_token)
        } else {
          setSession(null)
        }
      } catch (error) {
        console.error('Error checking Supabase session:', error)
        setSession(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()

    // Set up auth state change listener
    // This will fire when Supabase client session changes (e.g., token refresh)
    const supabase = getSupabaseClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setSession({
          user: session.user,
          session: {
            access_token: session.access_token,
            refresh_token: session.refresh_token,
          },
        })

        // When session changes (especially on TOKEN_REFRESHED), update cookies
        if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
          await updateSessionCookies(session.access_token, session.refresh_token)
        }
      } else {
        setSession(null)
      }
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {
    session,
    user: session?.user ?? null,
    isAuthenticated: !!session?.user,
    isLoading,
  }
}
