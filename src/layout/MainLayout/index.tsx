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
        ⚠️&nbsp;<span style={{ fontWeight: 'bold' }}>Warning:</span>&nbsp;This site is under active
        development and may be unstable. For critical issues, please contact support@workpace.io.
        Thank you!
      </div>
      <main className={styles.containerSize}>{children}</main>
    </>
  )
}
