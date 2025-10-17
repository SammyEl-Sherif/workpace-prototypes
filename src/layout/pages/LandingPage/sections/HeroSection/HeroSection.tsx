import Link from 'next/link'
import styles from './HeroSection.module.scss'

const HeroSection = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <h1 className={styles.title}>WorkPace</h1>
        <p className={styles.subtitle}>A change of pace in your online workspace</p>
        <div className={styles.cta}>
          <Link href="/prototypes" className={styles.primaryButton}>
            Explore Prototypes
          </Link>
          {/* <a href="#community" className={styles.secondaryButton}>
            Join Community
          </a> */}
        </div>
      </div>
      <div className={styles.gradientOverlay} />
    </section>
  )
}

export default HeroSection
