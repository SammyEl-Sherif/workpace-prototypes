import { Button, Text } from '@workpace/design-system'
import Link from 'next/link'

import styles from './PageBanner.module.scss'

interface PageBannerLogo {
  left: string
  right: string
}

interface PageBannerProps {
  logos: PageBannerLogo
  title: string
  subtitle: string
  ctaLabel: string
  ctaHref: string
}

export function PageBanner({ logos, title, subtitle, ctaLabel, ctaHref }: PageBannerProps) {
  return (
    <div className={styles.banner}>
      <div className={styles.bannerContent}>
        <div className={styles.bannerLogos}>
          <span className={styles.bannerLogo}>{logos.left}</span>
          <span className={styles.bannerConnector}>+</span>
          <span className={styles.bannerLogo}>{logos.right}</span>
        </div>
        <div className={styles.bannerText}>
          <Text as="p" variant="body-md" className={styles.bannerTitle}>
            {title}
          </Text>
          <Text as="p" variant="body-sm-paragraph" className={styles.bannerSubtitle}>
            {subtitle}
          </Text>
        </div>
        <Link href={ctaHref} className={styles.bannerCta}>
          <Button as="span" variant="default-secondary" className={styles.bannerButton}>
            {ctaLabel}
          </Button>
        </Link>
      </div>
    </div>
  )
}
