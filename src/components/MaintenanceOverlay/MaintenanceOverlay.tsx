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
 * Client-side maintenance fallback.
 *
 * The *primary* maintenance gate lives in `middleware.ts` — it rewrites
 * non-admin users to `/maintenance` before any page JS is sent, so there
 * is zero flicker. This component exists only as a safety-net for
 * client-side navigations that bypass middleware (e.g. `router.push`
 * within an already-loaded SPA session).
 *
 * Behaviour:
 * - Flag OFF → renders children normally for everyone
 * - Flag ON + admin user → renders children normally (admin bypass)
 * - Flag ON + non-admin/unauthenticated → shows maintenance overlay
 * - While flags are still loading → renders **nothing** (prevents flicker)
 * - /admin routes are never covered (protected separately by AdminGuard)
 * - /signin is never covered (users need to be able to sign in as admin)
 */
export const MaintenanceOverlay: FC<MaintenanceOverlayProps> = ({ children }) => {
  const router = useRouter()
  const { isEnabled, isAdmin, isLoading } = useFeatureFlagsContext()

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

  const isAdminRoute = router.pathname.startsWith('/admin')
  const isSigninPage = router.pathname === '/signin'
  const maintenanceActive = isEnabled('maintenance-overlay')

  // Check if we should hide the sign in button (workpace.io domain in production)
  // Check if hostname ends with workpace.io (handles both workpace.io and www.workpace.io)
  const shouldHideSignIn =
    typeof window !== 'undefined' &&
    process.env.NODE_ENV === 'production' &&
    window.location.hostname.endsWith('workpace.io')

  // Always bypass on admin routes and signin
  if (isAdminRoute || isSigninPage || isAdmin) {
    return <>{children}</>
  }

  // While flags are loading, render nothing instead of flashing children.
  // Middleware already handles the initial page load so this branch is
  // only hit during client-side navigations.
  if (isLoading) {
    return null
  }

  // Flag is off → render children normally
  if (!maintenanceActive) {
    return <>{children}</>
  }

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
          {!shouldHideSignIn && (
            <div className={styles.actions}>
              <Button variant="brand-secondary" onClick={handleSignIn}>
                Sign In
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
