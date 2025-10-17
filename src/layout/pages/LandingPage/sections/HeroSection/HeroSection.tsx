import { useSession } from 'next-auth/react'
import Link from 'next/link'

import { Routes } from '@/interfaces/routes'

import styles from './HeroSection.module.scss'

const HeroSection = () => {
  const { status } = useSession()

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <h1 className={styles.title}>WorkPace</h1>
        <p className={styles.subtitle}>A change of pace in your online workspace</p>
        <div className={styles.cta}>
          <Link href={Routes.PROTOTYPES} className={styles.primaryButton}>
            Explore Prototypes
          </Link>
          {status === 'authenticated' && (
            <Link href={Routes.ABOUT} className={styles.secondaryButton}>
              About
            </Link>
          )}
          {status !== 'authenticated' && (
            <Link href={Routes.SIGNIN} className={styles.secondaryButton}>
              Sign In
            </Link>
          )}
        </div>
      </div>
      <div className={styles.gradientOverlay} />
    </section>
  )
}

export default HeroSection
