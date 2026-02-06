import Link from 'next/link'

import { Routes } from '@/interfaces/routes'

import styles from './FeaturesSection.module.scss'

const FEATURES = [
  {
    title: 'Prototypes',
    description: 'Rapidly built applications that solve real problems and test new ideas.',
    tag: '🚀 Explore Projects',
    href: Routes.PROTOTYPES,
    // Replace with a real image path later
    image: '',
  },
  {
    title: 'Design System',
    description: 'A cohesive component library with tokens and reusable building blocks.',
    tag: '🎨 Browse Components',
    href: Routes.DESIGN_SYSTEM,
    image: '',
  },
  {
    title: 'System Design',
    description: 'Architectural patterns and infrastructure decisions at scale.',
    tag: '⚙️ View Architecture',
    href: Routes.SYSTEM_DESIGN,
    image: '',
  },
]

const FeaturesSection = () => {
  return (
    <section className={styles.features}>
      <div className={styles.container}>
        <div className={styles.cards}>
          {FEATURES.map((feature) => (
            <Link key={feature.title} href={feature.href} className={styles.card}>
              {/* Placeholder gradient — swap for <Image> when ready */}
              <div className={styles.cardImage} />
              <div className={styles.cardOverlay} />
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{feature.title}</h3>
                <p className={styles.cardDescription}>{feature.description}</p>
                <span className={styles.cardTag}>{feature.tag}</span>
                <span className={styles.cardButton}>Explore</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
