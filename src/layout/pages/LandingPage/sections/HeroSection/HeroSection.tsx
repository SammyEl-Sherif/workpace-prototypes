import { useEffect, useState } from 'react'

import { Button } from '@workpace/design-system'
import Link from 'next/link'

import { Routes } from '@/interfaces/routes'

import styles from './HeroSection.module.scss'

const ButtonComponent = Button as any

const rotatingPhrases = [
  'automate your reports',
  'streamline onboarding',
  'schedule without the back-and-forth',
  "organize your team's knowledge",
  'turn emails into action items',
  'sync data across your tools',
  'eliminate repetitive data entry',
  'generate invoices instantly',
]

interface HeroSectionProps {
  onBookConsultation: () => void
}

const HeroSection = ({ onBookConsultation }: HeroSectionProps) => {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setPhraseIndex((prev) => (prev + 1) % rotatingPhrases.length)
        setIsAnimating(false)
      }, 400)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          WorkPace helps you
          <span className={styles.rotatingWrapper}>
            <span
              className={`${styles.rotatingText} ${isAnimating ? styles.slideOut : styles.slideIn}`}
            >
              {rotatingPhrases[phraseIndex]}
            </span>
          </span>
        </h1>

        <div className={styles.cta}>
          <Link href={Routes.TEMPLATES} style={{ textDecoration: 'none' }}>
            <ButtonComponent as="span" variant="brand-secondary">
              Explore Templates →
            </ButtonComponent>
          </Link>
          <ButtonComponent variant="default-secondary" onClick={onBookConsultation}>
            Book a Consultation
          </ButtonComponent>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
