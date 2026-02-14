import { FC } from 'react'

import { Button, Text } from '@workpace/design-system'
import { useRouter } from 'next/router'

import { usePortalContext } from '@/contexts/PortalContextProvider'
import { Routes } from '@/interfaces/routes'

import styles from './PortalGuard.module.scss'

interface PortalGuardProps {
  children: React.ReactNode
}

export const PortalGuard: FC<PortalGuardProps> = ({ children }) => {
  const router = useRouter()
  const { isLoading, isPortalMember, isApproved, isPending, portalUser } = usePortalContext()

  if (isLoading) {
    return null
  }

  if (!isPortalMember) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <div className={styles.icon}>&#128203;</div>
          <Text variant="headline-md" className={styles.title}>
            Welcome to the Client Portal
          </Text>
          <Text variant="body-md" className={styles.message}>
            Sign up to get started with your organization&apos;s portal access.
          </Text>
          <Button variant="brand-primary" onClick={() => router.push(Routes.PORTAL_SIGNUP)}>
            Sign Up
          </Button>
        </div>
      </div>
    )
  }

  if (isPending) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <div className={styles.icon}>&#9203;</div>
          <Text variant="headline-md" className={styles.title}>
            Awaiting Approval
          </Text>
          <Text variant="body-md" className={styles.message}>
            Your portal access request is pending approval. You&apos;ll be notified once an
            administrator reviews your request.
          </Text>
        </div>
      </div>
    )
  }

  if (portalUser?.status === 'deactivated') {
    return (
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <div className={styles.icon}>&#128683;</div>
          <Text variant="headline-md" className={styles.title}>
            Access Deactivated
          </Text>
          <Text variant="body-md" className={styles.message}>
            Your portal access has been deactivated. Please contact your administrator for
            assistance.
          </Text>
        </div>
      </div>
    )
  }

  if (isApproved) {
    return <>{children}</>
  }

  return null
}
