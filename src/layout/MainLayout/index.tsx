import React, { ReactNode } from 'react'

import { NavbarVertical, WarningBanner } from '@/components'

import styles from './MainLayout.module.scss'

interface LayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: LayoutProps) {
  return (
    <div className={styles.pageLayout}>
      <NavbarVertical />
      <div className={styles.pageContent}>
        <WarningBanner />
        <main className={styles.containerSize}>{children}</main>
      </div>
    </div>
  )
}
