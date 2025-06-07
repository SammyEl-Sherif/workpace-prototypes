import React, { ReactNode } from 'react'
import { Text } from '@workpace/design-system'
import styles from './HeroLayout.module.scss'

interface LayoutProps {
  title: string
  subHeadingTitle?: string
  subheadingDescription?: string
}

export default function HeroLayout({ title, subHeadingTitle, subheadingDescription }: LayoutProps) {
  return (
    <div className={styles.heroSection}>
      <div className={styles.title}>{title}</div>
      <div className={styles.content}>
        <Text as="div" variant={'headline-lg-emphasis'}>
          {subHeadingTitle}
        </Text>
        <Text as="div" variant={'headline-md'}>
          {subheadingDescription}
        </Text>
      </div>
    </div>
  )
}
