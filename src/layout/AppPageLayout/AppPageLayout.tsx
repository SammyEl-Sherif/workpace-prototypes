import Link from 'next/link'
import { ReactNode } from 'react'

import { BreadcrumbItem, Breadcrumbs } from '@workpace/design-system'

import styles from './AppPageLayout.module.scss'

interface AppPageLayoutProps {
  /** Breadcrumb items to display at the top */
  breadcrumbs?: BreadcrumbItem[]
  /** Page title (simple string) */
  title?: string
  /** Optional subtitle below the title */
  subtitle?: string
  /** Custom title content (ReactNode) - if provided, overrides title/subtitle */
  titleContent?: ReactNode
  /** Page content */
  children: ReactNode
  /** Optional custom className for the content wrapper */
  contentClassName?: string
}

export const AppPageLayout = ({
  breadcrumbs,
  title,
  subtitle,
  titleContent,
  children,
  contentClassName,
}: AppPageLayoutProps) => {
  const hasHeader = breadcrumbs || title || titleContent

  return (
    <div className={styles.page}>
      {hasHeader && (
        <div className={styles.header}>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className={styles.breadcrumbsWrapper}>
              <Breadcrumbs linkAs={Link} items={breadcrumbs} size="lg" />
            </div>
          )}
          {titleContent ? (
            <div className={styles.titleSection}>{titleContent}</div>
          ) : (
            title && (
              <div className={styles.titleSection}>
                <h1 className={styles.title}>{title}</h1>
                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
              </div>
            )
          )}
        </div>
      )}
      <div className={`${styles.content} ${contentClassName || ''}`}>{children}</div>
    </div>
  )
}
