import { ReactNode } from 'react'

import styles from './PortalPageLayout.module.scss'

interface PortalPageLayoutProps {
  title?: string
  subtitle?: string
  children: ReactNode
}

export const PortalPageLayout = ({ title, subtitle, children }: PortalPageLayoutProps) => {
  return (
    <div className={styles.page}>
      {title && (
        <div className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      )}
      <div className={styles.content}>{children}</div>
    </div>
  )
}
