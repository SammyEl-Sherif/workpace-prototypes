import { App } from '@/interfaces/apps'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import styles from './AppsSection.module.scss'

interface AppsSectionProps {
  apps: App[]
}

const AppsSection = ({ apps }: AppsSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (apps.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % apps.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [apps])

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + apps.length) % apps.length)
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % apps.length)
  }

  if (apps.length === 0) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.title}>Apps</h2>
          <p className={styles.subtitle}>Loading apps...</p>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Apps</h2>
        <p className={styles.subtitle}>
          Welcome to WorkPace&apos;s app ecosystem, where we build products designed to bring a
          change of pace to your online workspace.
        </p>

        <div className={styles.carousel}>
          <div className={styles.carouselContainer}>
            <div
              className={styles.carouselTrack}
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {apps.map((app, index) => (
                <div key={index} className={styles.carouselItem}>
                  <div className={styles.card}>
                    <div className={styles.cardHeader}>
                      <div className={styles.icon}>{app.icon}</div>
                      <h3 className={styles.cardTitle}>{app.name}</h3>
                    </div>

                    <div className={styles.cardContent}>
                      <p className={styles.cardDescription} title={app.description}>
                        {app.description}
                      </p>
                      <div className={styles.cardMeta}>
                        <span className={styles.stage}>{app.stage}</span>
                        <span className={styles.tech}>{app.tech}</span>
                      </div>
                    </div>

                    <div className={styles.cardFooter}>
                      <a
                        href={`https://workpace.io${app.path}`}
                        className={styles.cardButton}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Try App
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.carouselControls}>
            <button className={styles.controlButton} onClick={handlePrev} aria-label="Previous app">
              ‹
            </button>
            <div className={styles.dots}>
              {apps.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to app ${index + 1}`}
                />
              ))}
            </div>
            <button className={styles.controlButton} onClick={handleNext} aria-label="Next app">
              ›
            </button>
          </div>
        </div>

        <div className={styles.viewAll}>
          <Link href="/apps" className={styles.viewAllButton}>
            View All Apps
          </Link>
        </div>
      </div>
    </section>
  )
}

export default AppsSection
