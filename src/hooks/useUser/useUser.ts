import { useUserInfoContext } from '@/contexts/UserInfoContextProvider'
import { useCallback } from 'react'
// import { useManualFetch } from '../useManualFetch'
import { signOut as nextAuthSignout } from 'next-auth/react'

export const useUser = () => {
  const userInfo = useUserInfoContext()
  // TODO: Implement revoke session, investigate errors
  // Note: revoke-session is now handled at /api/auth/revoke-session (unified with auth handler)
  // const revokeSession = useManualFetch('auth/revoke-session')

  const signOut = useCallback(async () => {
    // const [, error] = await revokeSession()
    // if (error) {
    //   console.error('Error revoking session:', error)
    // }
    const browserWindow = typeof window !== 'undefined' && window.document ? window : null
    const pathname = window?.location.pathname

    browserWindow?.sessionStorage?.clear()
    nextAuthSignout({
      redirect: true,
      callbackUrl: `/signin?signout=true${pathname ? `&callbackUrl=${pathname}` : ''}`,
    })
  }, [])
  return {
    user: userInfo.userProfile,
    signOut,
  }
}
