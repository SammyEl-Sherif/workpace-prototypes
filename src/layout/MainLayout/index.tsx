import React, { ReactNode } from 'react'

import styles from './MainLayout.module.scss'

interface LayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: LayoutProps) {
  return (
    <div className={styles.pageLayout}>
      <div className={styles.pageContent}>
        <main className={styles.containerSize}>{children}</main>
      </div>
    </div>
  )
}
