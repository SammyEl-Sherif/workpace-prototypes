import { ReactNode } from 'react'

import styles from './DefaultLayout.module.scss'

interface DefaultLayoutProps {
  title?: string
  subtitle?: string
  headerAction?: ReactNode
  children: ReactNode
  contentClassName?: string
}

export const DefaultLayout = ({
  title,
  subtitle,
  headerAction,
  children,
  contentClassName,
}: DefaultLayoutProps) => {
  return (
    <div className={styles.page}>
      {title && (
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.headerText}>
              <h1 className={styles.title}>{title}</h1>
              {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            </div>
            {headerAction && <div className={styles.headerAction}>{headerAction}</div>}
          </div>
        </div>
      )}
      <div className={contentClassName}>{children}</div>
    </div>
  )
}
