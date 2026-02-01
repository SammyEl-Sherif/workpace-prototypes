import { useEffect, useState } from 'react'

import { Button, Text } from '@workpace/design-system'
import { useRouter } from 'next/router'

import { Routes } from '@/interfaces/routes'

import styles from './HeroSection.module.scss'

// Type assertion workaround for Button and Text component type issues
const ButtonComponent = Button as any
const TextComponent = Text as any

const subtitles = [
  'A change of pace in your online workspace.',
  'Modern Tools for a New Pace.',
  'Where thoughtful design meets technical excellence.',
  'Innovative productivity software for the modern professional.',
]

const HeroSection = () => {
  const router = useRouter()
  const [subtitle, setSubtitle] = useState(subtitles[0])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setSubtitle(subtitles[Math.floor(Math.random() * subtitles.length)])
    // Trigger animation after mount
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  return (
    <section className={styles.hero}>
      <div className={styles.background}>
        <div className={styles.morphingShape} />
        <div className={styles.morphingShape} />
        <div className={styles.morphingShape} />
        <div className={styles.morphingShape} />
        <div className={styles.morphingShape} />
      </div>
      <div className={styles.container}>
        <div className={`${styles.content} ${isVisible ? styles.visible : ''}`}>
          <TextComponent as="h1" variant="headline-lg" className={styles.title}>
            WorkPace
          </TextComponent>
          <TextComponent as="p" variant="headline-md" className={styles.subtitle}>
            {subtitle}
          </TextComponent>
          <TextComponent as="p" variant="body-lg" className={styles.description}>
            Modern productivity tools built with cutting-edge technology—where thoughtful design
            meets technical excellence.
          </TextComponent>
          <div className={styles.cta}>
            <ButtonComponent
              onClick={() => router.push(Routes.PROTOTYPES)}
              variant="brand-secondary"
            >
              Explore Prototypes
            </ButtonComponent>
            <ButtonComponent
              onClick={() => router.push(Routes.SYSTEM_DESIGN)}
              variant="default-secondary"
            >
              System Design
            </ButtonComponent>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
