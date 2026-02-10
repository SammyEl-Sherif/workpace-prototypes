import { FC } from 'react'

import { Button, Text } from '@workpace/design-system'
import { useRouter } from 'next/router'

import { useFeatureFlagsContext } from '@/contexts/FeatureFlagsContextProvider'
import { Routes } from '@/interfaces/routes'

import styles from './AdminGuard.module.scss'

interface AdminGuardProps {
  children: React.ReactNode
}

/**
 * Guard component that restricts access to admin-only routes.
 * If the current user does not have an admin role, a "Not Authorized" screen is shown
 * instead of the page content.
 */
export const AdminGuard: FC<AdminGuardProps> = ({ children }) => {
  const router = useRouter()
  const { isAdmin, isLoading } = useFeatureFlagsContext()

  // While loading, don't flash unauthorized screen
  if (isLoading) {
    return null
  }

  if (!isAdmin) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <div className={styles.icon}>&#128274;</div>
          <Text variant="headline-md" className={styles.title}>
            Not Authorized
          </Text>
          <Text variant="body-md" className={styles.message}>
            You don&apos;t have permission to access this page. Admin privileges are required.
          </Text>
          <Button variant="brand-primary" onClick={() => router.push(Routes.HOME)}>
            Go Home
          </Button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
