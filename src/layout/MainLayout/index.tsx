import React, { ReactNode } from 'react'

import { Navbar } from '@/components'

import styles from './MainLayout.module.scss'
import { PromotionalBanner } from '@/components/PromotionalBanner'

interface LayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: LayoutProps) {
  return (
    <div className={styles.pageLayout}>
      <Navbar />
      <div className={styles.pageContent}>
        <PromotionalBanner hide={true} />
        <main className={styles.containerSize}>{children}</main>
      </div>
    </div>
  )
}
