import React, { ReactNode } from 'react'

import { NavbarVertical } from '@/components'

import styles from './MainLayout.module.scss'
import { PromotionalBanner } from '@/components/PromotionalBanner'

interface LayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: LayoutProps) {
  return (
    <div className={styles.pageLayout}>
      <NavbarVertical />
      <div className={styles.pageContent}>
        {/* <WarningBanner /> */}
        <PromotionalBanner />
        <main className={styles.containerSize}>{children}</main>
      </div>
    </div>
  )
}
