import { useEffect, useState } from 'react'

import { Button } from '@workpace/design-system'
import Image from 'next/image'
import Link from 'next/link'

import { Routes } from '@/interfaces/routes'

import styles from './HeroSection.module.scss'

const ButtonComponent = Button as any

const subtitles = [
  'Change Your Pace',
  'A Change of Pace',
  'A change of pace in your online workspace',
]

const STATS = [
  { value: '500+', label: 'Templates Created' },
  { value: '100+', label: 'Companies Served' },
  { value: '98%', label: 'Client Satisfaction' },
]

interface HeroSectionProps {
  onBookConsultation: () => void
}

const HeroSection = ({ onBookConsultation }: HeroSectionProps) => {
  const [subtitle, setSubtitle] = useState(subtitles[0])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setSubtitle(subtitles[Math.floor(Math.random() * subtitles.length)])
    // Trigger entrance animation after mount
    requestAnimationFrame(() => setIsLoaded(true))
  }, [])

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Text content */}
          <div className={styles.content}>
            <div className={styles.textGroup}>
              <h1 className={`${styles.title} ${isLoaded ? styles.animateIn : ''}`}>
                Change the Pace of Your Workspace
              </h1>
              <p
                className={`${styles.subtitle} ${isLoaded ? styles.animateIn : ''}`}
                style={{ animationDelay: '100ms' }}
              >
                WorkPace transforms how your team collaborates. From Notion workspaces to custom
                software solutions, we build the tools that power your success.
              </p>
            </div>

            <div
              className={`${styles.cta} ${isLoaded ? styles.animateIn : ''}`}
              style={{ animationDelay: '200ms' }}
            >
              <Link href={Routes.TEMPLATES} style={{ textDecoration: 'none' }}>
                <ButtonComponent as="span" variant="brand-secondary">
                  Explore Templates →
                </ButtonComponent>
              </Link>
              <ButtonComponent variant="default-secondary" onClick={onBookConsultation}>
                Book a Consultation
              </ButtonComponent>
            </div>

            <div
              className={`${styles.stats} ${isLoaded ? styles.animateIn : ''}`}
              style={{ animationDelay: '350ms' }}
            >
              {STATS.map((stat) => (
                <div key={stat.label} className={styles.stat}>
                  <div className={styles.statValue}>{stat.value}</div>
                  <div className={styles.statLabel}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero image */}
          <div
            className={`${styles.imageWrapper} ${isLoaded ? styles.animateInRight : ''}`}
            style={{ animationDelay: '200ms' }}
          >
            <div className={styles.imageContainer}>
              <Image
                src="https://images.unsplash.com/photo-1742440710226-450e3b85c100?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b3Jrc3BhY2UlMjBjb2xsYWJvcmF0aW9ufGVufDF8fHx8MTc3MDY0MTMzMXww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Modern workspace collaboration"
                width={1080}
                height={1080}
                className={styles.heroImage}
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative background elements */}
      <div className={styles.bgDecoration} aria-hidden="true" />
    </section>
  )
}

export default HeroSection
