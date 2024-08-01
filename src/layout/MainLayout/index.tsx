import React, { ReactNode } from 'react'

import styles from './MainLayout.module.scss'
import { Navbar } from '../../modules/Navbar'

interface LayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: LayoutProps) {
  return (
    <>
      <Navbar />
      <main className={styles.containerSize}>{children}</main>
    </>
  )
}
