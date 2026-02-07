import { useEffect, useState } from 'react'

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

export const useSupabaseSession = () => {
  const [session, setSession] = useState<SupabaseSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const supabase = getSupabaseClient()

        // First, try to get session from cookies and set it in Supabase client
        const accessToken =
          typeof document !== 'undefined'
            ? document.cookie
                .split('; ')
                .find((row) => row.startsWith('sb-access-token='))
                ?.split('=')[1]
            : null
        const refreshToken =
          typeof document !== 'undefined'
            ? document.cookie
                .split('; ')
                .find((row) => row.startsWith('sb-refresh-token='))
                ?.split('=')[1]
            : null

        // If we have tokens in cookies, set them in Supabase client
        if (accessToken && refreshToken) {
          try {
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            })
          } catch (error) {
            // If setting session fails, tokens might be expired
            console.warn('Failed to set session from cookies:', error)
          }
        }

        // Get the current session
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
    const supabase = getSupabaseClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession({
          user: session.user,
          session: {
            access_token: session.access_token,
            refresh_token: session.refresh_token,
          },
        })
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
