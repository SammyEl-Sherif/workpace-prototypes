import { useUserInfoContext } from '@/contexts/UserInfoContextProvider'
import { signOut as nextAuthSignout } from 'next-auth/react'
import { useCallback } from 'react'

export const useUser = () => {
  const userInfo = useUserInfoContext()

  const signOut = useCallback(async () => {
    // Check if we have Supabase session
    const hasSupabaseSession =
      typeof document !== 'undefined' &&
      (document.cookie.includes('sb-access-token') || document.cookie.includes('sb-refresh-token'))

    // Sign out from Supabase if session exists
    if (hasSupabaseSession) {
      try {
        await fetch('/api/auth/supabase/signout', {
          method: 'POST',
        })
      } catch (error) {
        console.error('Error signing out from Supabase:', error)
        // Continue with other sign out steps
      }
    }

    // Clear all local storage
    if (typeof window !== 'undefined') {
      window.sessionStorage?.clear()
      window.localStorage?.clear()
    }

    // Get pathname and construct callback URL
    const pathname = typeof window !== 'undefined' ? window.location.pathname : ''
    const callbackUrl = `/signin?signout=true${
      pathname ? `&callbackUrl=${encodeURIComponent(pathname)}` : ''
    }`

    // Clear NextAuth session and redirect to signin
    try {
      await nextAuthSignout({
        redirect: true,
        callbackUrl: callbackUrl,
      })
    } catch (error) {
      console.error('Error during sign out:', error)
      // Fallback: just redirect to signin
      if (typeof window !== 'undefined') {
        window.location.href = callbackUrl
      }
    }
  }, [])

  return {
    user: userInfo.userProfile,
    signOut,
  }
}
