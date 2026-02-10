import { NextPage } from 'next'
import Head from 'next/head'
import { useCallback } from 'react'

import { Button, Text } from '@workpace/design-system'
import { signOut as nextAuthSignout } from 'next-auth/react'

import styles from '@/components/MaintenanceOverlay/MaintenanceOverlay.module.scss'

/**
 * Standalone maintenance page.
 * Users are rewritten here by middleware when the `maintenance-overlay`
 * feature flag is enabled and they are not an admin.
 *
 * This page is intentionally minimal — no providers, no layout, no data
 * fetching — so it loads instantly with zero flicker.
 */
const MaintenancePage: NextPage = () => {
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
    <>
      <Head>
        <title>Under Maintenance — WorkPace</title>
      </Head>
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
    </>
  )
}

export default MaintenancePage
