import { useEffect, useState } from 'react'

import { Button } from '@workpace/design-system'
import { useRouter } from 'next/router'

import { Routes } from '@/interfaces/routes'

import styles from './HeroSection.module.scss'

// Type assertion workaround for Button component type issue
const ButtonComponent = Button as any

const subtitles = [
  'Change Your Pace.',
  'A Change of Pace.',
  'A change of pace in your online workspace.',
  'Modern Tools for a New Pace.',
  'Modern Solutions for Age Old Problems.',
]

const HeroSection = () => {
  const router = useRouter()
  const [subtitle, setSubtitle] = useState(subtitles[0])

  useEffect(() => {
    setSubtitle(subtitles[Math.floor(Math.random() * subtitles.length)])
  }, [])

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <h1 className={styles.title}>WorkPace</h1>
        <p className={styles.subtitle}>{subtitle}</p>
        <div className={styles.cta}>
          <ButtonComponent onClick={() => router.push(Routes.PROTOTYPES)} variant="brand-secondary">
            Our Products
          </ButtonComponent>
          <ButtonComponent
            onClick={() => router.push(Routes.SYSTEM_DESIGN)}
            variant="default-secondary"
          >
            System Design
          </ButtonComponent>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
