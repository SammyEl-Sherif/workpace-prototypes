import React, { ReactNode } from 'react'

import { Banner, NavbarVertical } from '@/components'

import styles from './NavigationLayout.module.scss'
import { NavbarContextProvider } from '@/contexts'

interface LayoutProps {
  children: ReactNode
}

export default function NavigationLayout({ children }: LayoutProps) {
  const enableBanner = process.env.NEXT_PUBLIC_DISABLE_RBAC === 'true'
  return (
    <NavbarContextProvider>
      <NavbarVertical>
        <div className={styles.children}>
          <>{enableBanner ? <Banner type="promotion" /> : null}</>
          <>{children}</>
        </div>
      </NavbarVertical>
    </NavbarContextProvider>
  )
}
