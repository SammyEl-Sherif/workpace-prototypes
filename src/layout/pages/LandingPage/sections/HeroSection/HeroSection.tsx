import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import Link from 'next/link'

import { Routes } from '@/interfaces/routes'

import styles from './HeroSection.module.scss'

const rotatingPhrases = [
  'automate your reports',
  'organize your knowledge',
  'turn emails into actions',
  'sync data across tools',
  'eliminate repetitive work',
]

const HeroSection = () => {
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
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          WorkPace helps you
          <span className={styles.rotatingWrapper}>
            <span
              className={`${styles.rotatingText} ${isAnimating ? styles.slideOut : styles.slideIn}`}
            >
              {rotatingPhrases[phraseIndex]}
            </span>
          </span>
        </motion.h1>

        <motion.div
          className={styles.cards}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        >
          <Link href={Routes.WORKSPACES} className={styles.card}>
            <div className={styles.cardText}>
              <span className={styles.cardTitle}>Workspaces</span>
              <span className={styles.cardDesc}>Tailored spaces for your team</span>
            </div>
            <span className={styles.cardArrow}>→</span>
          </Link>
          <Link href={Routes.APPS} className={styles.card}>
            <div className={styles.cardText}>
              <span className={styles.cardTitle}>Integrations</span>
              <span className={styles.cardDesc}>Connect your favorite tools</span>
            </div>
            <span className={styles.cardArrow}>→</span>
          </Link>
          <Link href={Routes.TEMPLATES} className={styles.card}>
            <div className={styles.cardText}>
              <span className={styles.cardTitle}>Templates</span>
              <span className={styles.cardDesc}>Pre-built workflows ready to use</span>
            </div>
            <span className={styles.cardArrow}>→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection
