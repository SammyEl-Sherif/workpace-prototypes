import { ReactNode, useMemo } from 'react'

import cn from 'classnames'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

import { AuthOverlay } from '@/components'
import { PromotionalBanner } from '@/components/PromotionalBanner'
import { APPS } from '@/interfaces/apps'
import { StandardNavbar, SubNavbar } from '@/layout/pages/LandingPage/components'

import styles from './MainLayout.module.scss'

interface LayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: LayoutProps) {
  const { status } = useSession()
  const router = useRouter()
  const { pathname } = router

  // Show overlay for unauthenticated users on protected routes
  const shouldShowOverlay =
    status === 'unauthenticated' &&
    pathname !== '/' &&
    pathname !== '/signin' &&
    pathname !== '/design-system' &&
    pathname !== '/system-design' &&
    !pathname.startsWith('/templates')

  // SubNavbar appears on individual app pages (e.g. /apps/sms)
  const hasSubNavbar = useMemo(() => APPS.some((p) => pathname === p.path), [pathname])

  const contentClass = cn(styles.pageContent, {
    [styles.withSubNavbar]: hasSubNavbar,
  })

  const content = (
    <div className={contentClass}>
      <PromotionalBanner hide={true} />
      {children}
    </div>
  )

  return (
    <div className={styles.pageLayout}>
      <StandardNavbar />
      <SubNavbar />
      {shouldShowOverlay ? <AuthOverlay>{content}</AuthOverlay> : content}
    </div>
  )
}
