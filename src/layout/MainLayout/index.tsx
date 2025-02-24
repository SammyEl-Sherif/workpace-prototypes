import React, { ReactNode } from 'react'

import styles from './MainLayout.module.scss'
import { Navbar } from '../../components/Navbar'

interface LayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: LayoutProps) {
  return (
    <>
      <Navbar />
      <div className={styles.banner}>
        ⚠️ <strong>Warning:</strong> This site is under active development and may be unstable. For
        critical issues, please contact &nbsp;
        <a href="mailto:support@workpace.io" className={styles.link}>
          support@workpace.io
        </a>
        . Thank you!
      </div>
      <main className={styles.containerSize}>{children}</main>
    </>
  )
}
