import { Card, Text } from '@workpace/design-system'
import clsx from 'classnames'

import { useScrollAnimation } from '@/hooks'

import styles from './FeaturesSection.module.scss'

// Type assertion workaround for Text component type issue
const TextComponent = Text as any

interface Feature {
  title: string
  description: string
  icon: string
}

const features: Feature[] = [
  {
    title: 'Modern Technology',
    description:
      'Built with cutting-edge web technologies and thoughtful design patterns that demonstrate both practical application and technical craftsmanship.',
    icon: '⚡',
  },
  {
    title: 'Innovative Workflows',
    description:
      'Enhance focus and make digital work more efficient with innovative solutions that solve real productivity challenges. Each prototype showcases clean, focused design principles designed to bring a change of pace to your online workspace.',
    icon: '🚀',
  },
  {
    title: 'Technical Excellence',
    description:
      'Evidence of advanced full-stack development capabilities and product thinking, built for productivity enthusiasts and digital professionals.',
    icon: '🎯',
  },
]

const FeaturesSection = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2, triggerOnce: true })

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={styles.section}>
      <div className={styles.container}>
        <div className={clsx(styles.header, { [styles.visible]: isVisible })}>
          <TextComponent as="h2" variant="headline-lg" className={styles.title}>
            Built for Modern Productivity
          </TextComponent>
          <TextComponent as="p" variant="body-lg" className={styles.subtitle}>
            Modern productivity tools built with cutting-edge technology—where thoughtful design
            meets technical excellence.
          </TextComponent>
        </div>

        <div className={styles.grid}>
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={clsx(styles.featureCard, {
                [styles.visible]: isVisible,
              })}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Card variant="default" className={styles.card}>
                <div className={styles.icon}>{feature.icon}</div>
                <TextComponent as="h3" variant="headline-sm" className={styles.featureTitle}>
                  {feature.title}
                </TextComponent>
                <TextComponent as="p" variant="body-md" className={styles.featureDescription}>
                  {feature.description}
                </TextComponent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
