import { ReactNode } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/router'

import { Text } from '@workpace/design-system'

import { Routes } from '@/interfaces/routes'

import styles from './PortalLayout.module.scss'

interface PortalLayoutProps {
  children: ReactNode
}

const navItems = [
  { label: 'Home', href: Routes.PORTAL },
  { label: 'Intake', href: Routes.PORTAL_INTAKE },
  { label: 'Contracts', href: Routes.PORTAL_CONTRACTS },
  { label: 'Status', href: Routes.PORTAL_STATUS },
  { label: 'Requests', href: Routes.PORTAL_REQUESTS },
  { label: 'Settings', href: Routes.PORTAL_SETTINGS },
]

export const PortalLayout = ({ children }: PortalLayoutProps) => {
  const router = useRouter()

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Text variant="headline-sm" className={styles.logo}>
            Client Portal
          </Text>
        </div>
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${
                item.href === Routes.PORTAL
                  ? router.pathname === item.href
                    ? styles.active
                    : ''
                  : router.pathname.startsWith(item.href)
                  ? styles.active
                  : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  )
}
