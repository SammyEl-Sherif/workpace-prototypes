import React, { ReactNode } from 'react'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

import { AuthOverlay, Navbar } from '@/components'

import styles from './MainLayout.module.scss'
import { PromotionalBanner } from '@/components/PromotionalBanner'

interface LayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: LayoutProps) {
  const { status } = useSession()
  const router = useRouter()
  const { pathname } = router

  // Show overlay for unauthenticated users on protected routes
  // But allow landing page and other public routes to render normally
  const shouldShowOverlay =
    status === 'unauthenticated' &&
    pathname !== '/' &&
    pathname !== '/design-system' &&
    pathname !== '/system-design'

  const pageContent = (
    <div className={styles.pageContent}>
      <PromotionalBanner hide={true} />
      <main className={styles.containerSize}>{children}</main>
    </div>
  )

  return (
    <div className={styles.pageLayout}>
      <Navbar />
      {shouldShowOverlay ? <AuthOverlay>{pageContent}</AuthOverlay> : pageContent}
    </div>
  )
}
