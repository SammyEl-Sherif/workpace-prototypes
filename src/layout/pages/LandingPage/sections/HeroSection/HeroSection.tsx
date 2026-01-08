import { Button } from '@workpace/design-system'
import { useRouter } from 'next/router'

import { Routes } from '@/interfaces/routes'

import styles from './HeroSection.module.scss'

// Type assertion workaround for Button component type issue
const ButtonComponent = Button as any

const HeroSection = () => {
  const router = useRouter()

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <h1 className={styles.title}>WorkPace</h1>
        <p className={styles.subtitle}>Change Your Pace.</p>
        <div className={styles.cta}>
          <ButtonComponent onClick={() => router.push(Routes.PROTOTYPES)} variant="brand-primary">
            Products
          </ButtonComponent>
          <ButtonComponent onClick={() => router.push(Routes.DESIGN_SYSTEM)} variant="brand-secondary">
            Design System
          </ButtonComponent>
          <ButtonComponent onClick={() => router.push(Routes.SYSTEM_DESIGN)} variant="brand-secondary">
            System Design
          </ButtonComponent>
        </div>
      </div>
      <div className={styles.gradientOverlay} />
    </section>
  )
}

export default HeroSection
