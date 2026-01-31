import { useUserInfoContext } from '@/contexts/UserInfoContextProvider'
import { useCallback } from 'react'
import { useManualFetch } from '../useManualFetch'
import { signOut as nextAuthSignout } from 'next-auth/react'

export const useUser = () => {
  const userInfo = useUserInfoContext()
  const revokeSession = useManualFetch('revoke-session')

  const signOut = useCallback(async () => {
    // Revoke session on Auth0 before clearing local session
    try {
      const [, error] = await revokeSession()
      if (error) {
        console.error('Error revoking session:', error)
        // Continue with sign out even if revocation fails
      }
    } catch (error) {
      console.error('Unexpected error during session revocation:', error)
      // Continue with sign out even if revocation fails
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

    // Use NextAuth's signOut which will clear cookies
    // Then redirect to our logout endpoint which will handle Auth0 logout
    try {
      // First clear NextAuth session
      await nextAuthSignout({ redirect: false })

      // Then redirect to logout endpoint which will redirect to Auth0
      if (typeof window !== 'undefined') {
        window.location.href = `/api/logout?callbackUrl=${encodeURIComponent(callbackUrl)}`
      }
    } catch (error) {
      console.error('Error during sign out:', error)
      // Fallback: just redirect to logout endpoint
      if (typeof window !== 'undefined') {
        window.location.href = `/api/logout?callbackUrl=${encodeURIComponent(callbackUrl)}`
      }
    }
  }, [revokeSession])

  return {
    user: userInfo.userProfile,
    signOut,
  }
}
