import { FC, useCallback } from 'react'

import { Button, Text } from '@workpace/design-system'
import { signOut as nextAuthSignout } from 'next-auth/react'
import { useRouter } from 'next/router'

import { useFeatureFlagsContext } from '@/contexts/FeatureFlagsContextProvider'

import styles from './MaintenanceOverlay.module.scss'

interface MaintenanceOverlayProps {
  children: React.ReactNode
}

/**
 * Maintenance overlay that covers the entire app when the `maintenance-overlay`
 * feature flag is enabled. Admin users bypass the overlay.
 *
 * - Flag OFF → renders children normally for everyone
 * - Flag ON + admin user → renders children normally (admin bypass)
 * - Flag ON + non-admin/unauthenticated → shows maintenance overlay
 * - /admin routes are never covered (protected separately by AdminGuard)
 * - /signin is never covered (users need to be able to sign in as admin)
 */
export const MaintenanceOverlay: FC<MaintenanceOverlayProps> = ({ children }) => {
  const router = useRouter()
  const { isEnabled, isAdmin, isLoading } = useFeatureFlagsContext()

  const isAdminRoute = router.pathname.startsWith('/admin')
  const isSigninPage = router.pathname === '/signin'
  const maintenanceActive = isEnabled('maintenance-overlay')

  // Don't show overlay on admin routes, signin, for admins, or while flags are loading
  if (isAdminRoute || isSigninPage || isAdmin || !maintenanceActive || isLoading) {
    return <>{children}</>
  }

  const handleSignIn = useCallback(async () => {
    // Clear Supabase session cookies
    try {
      await fetch('/api/auth/supabase/signout', { method: 'POST' })
    } catch {
      // Continue even if this fails
    }

    // Clear local storage
    if (typeof window !== 'undefined') {
      window.sessionStorage?.clear()
      window.localStorage?.clear()
    }

    // Clear NextAuth session and redirect to sign-in
    try {
      await nextAuthSignout({
        redirect: true,
        callbackUrl: '/signin?signout=true',
      })
    } catch {
      // Fallback: just redirect
      if (typeof window !== 'undefined') {
        window.location.href = '/signin?signout=true'
      }
    }
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.overlay}>
        <div className={styles.overlayContent}>
          <div className={styles.icon}>&#128736;</div>
          <Text variant="headline-md" className={styles.title}>
            Under Development
          </Text>
          <Text variant="body-md" className={styles.message}>
            WorkPace is currently undergoing maintenance and improvements. We&apos;re working hard
            to bring you an even better experience.
          </Text>
          <Text variant="body-sm" className={styles.subtitle}>
            Please check back soon — we won&apos;t be long!
          </Text>
          <div className={styles.actions}>
            <Button variant="brand-secondary" onClick={handleSignIn}>
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
