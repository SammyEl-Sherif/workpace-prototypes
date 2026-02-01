import { Prototype } from '@/interfaces/prototypes'
import { Text } from '@workpace/design-system'
import Link from 'next/link'

import { useScrollAnimation } from '@/hooks'

import styles from './PrototypesSection.module.scss'

// Type assertion workaround for Text component type issue
const TextComponent = Text as any

interface PrototypesSectionProps {
  prototypes: Prototype[]
}

const PrototypesSection = ({ prototypes }: PrototypesSectionProps) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1, triggerOnce: true })

  if (prototypes.length === 0) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.header}>
            <TextComponent as="h2" variant="headline-lg" className={styles.title}>
              Our Prototypes
            </TextComponent>
            <TextComponent as="p" variant="body-lg" className={styles.subtitle}>
              Loading prototypes...
            </TextComponent>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={styles.section}>
      <div className={styles.container}>
        <div className={`${styles.header} ${isVisible ? styles.visible : ''}`}>
          <TextComponent as="h2" variant="headline-lg" className={styles.title}>
            Our Prototypes
          </TextComponent>
          <TextComponent as="p" variant="body-lg" className={styles.subtitle}>
            Explore our collection of innovative productivity tools, each designed to bring a change
            of pace to your online workspace.
          </TextComponent>
        </div>

        <div className={`${styles.grid} ${isVisible ? styles.visible : ''}`}>
          {prototypes.map((prototype, index) => (
            <a
              key={index}
              href={`https://workpace.io${prototype.path}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.card}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className={styles.cardInner}>
                <div className={styles.cardHeader}>
                  <div className={styles.iconWrapper}>
                    <div className={styles.icon}>{prototype.icon}</div>
                  </div>
                  <div className={styles.cardMeta}>
                    <span className={styles.stage}>{prototype.stage}</span>
                    <span className={styles.tech}>{prototype.tech}</span>
                  </div>
                </div>

                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>
                    {prototype.name.startsWith(prototype.icon)
                      ? prototype.name.slice(prototype.icon.length).trim()
                      : prototype.name}
                  </h3>
                  <p className={styles.cardDescription}>{prototype.description}</p>
                </div>

                <div className={styles.cardFooter}>
                  <span className={styles.cardLink}>
                    Try Prototype
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 12L10 8L6 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {prototypes.length > 0 && (
          <div className={`${styles.viewAll} ${isVisible ? styles.visible : ''}`}>
            <Link href="/prototypes" className={styles.viewAllButton}>
              View All Prototypes
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

export default PrototypesSection
