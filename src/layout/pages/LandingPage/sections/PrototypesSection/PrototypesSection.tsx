import { Prototype } from '@/interfaces/prototypes'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import styles from './PrototypesSection.module.scss'

interface PrototypesSectionProps {
  prototypes: Prototype[]
}

const PrototypesSection = ({ prototypes }: PrototypesSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (prototypes.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % prototypes.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [prototypes])

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + prototypes.length) % prototypes.length)
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % prototypes.length)
  }

  if (prototypes.length === 0) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.title}>Prototypes</h2>
          <p className={styles.subtitle}>Loading prototypes...</p>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Prototypes</h2>
        <p className={styles.subtitle}>
          Welcome to WorkPace&apos;s prototyping environment, where we test products designed to
          bring a change of pace to your online workspace.
        </p>

        <div className={styles.carousel}>
          <div className={styles.carouselContainer}>
            <div
              className={styles.carouselTrack}
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {prototypes.map((prototype, index) => (
                <div key={index} className={styles.carouselItem}>
                  <div className={styles.card}>
                    <div className={styles.cardHeader}>
                      <div className={styles.icon}>{prototype.icon}</div>
                      <h3 className={styles.cardTitle}>{prototype.name}</h3>
                    </div>

                    <div className={styles.cardContent}>
                      <p className={styles.cardDescription} title={prototype.description}>
                        {prototype.description}
                      </p>
                      <div className={styles.cardMeta}>
                        <span className={styles.stage}>{prototype.stage}</span>
                        <span className={styles.tech}>{prototype.tech}</span>
                      </div>
                    </div>

                    <div className={styles.cardFooter}>
                      <a
                        href={`https://workpace.io${prototype.path}`}
                        className={styles.cardButton}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Try Prototype
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.carouselControls}>
            <button
              className={styles.controlButton}
              onClick={handlePrev}
              aria-label="Previous prototype"
            >
              ‹
            </button>
            <div className={styles.dots}>
              {prototypes.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to prototype ${index + 1}`}
                />
              ))}
            </div>
            <button
              className={styles.controlButton}
              onClick={handleNext}
              aria-label="Next prototype"
            >
              ›
            </button>
          </div>
        </div>

        <div className={styles.viewAll}>
          <Link href="/prototypes" className={styles.viewAllButton}>
            View All Prototypes
          </Link>
        </div>
      </div>
    </section>
  )
}

export default PrototypesSection
