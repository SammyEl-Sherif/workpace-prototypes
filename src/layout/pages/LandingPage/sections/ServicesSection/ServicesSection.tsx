import { Text } from '@workpace/design-system'
import cn from 'classnames'

import { useScrollReveal } from '../../hooks'

import styles from './ServicesSection.module.scss'

const services = [
  {
    icon: '📋',
    title: 'Notion Templates',
    description:
      'Access our library of free and premium templates. Upgrade to Pro for $10/mo and unlock unlimited access to all templates.',
    features: ['Free templates available', 'Pro plan: $10/mo', 'All-inclusive access'],
  },
  {
    icon: '👥',
    title: 'Notion Consulting',
    description:
      "We'll create and onboard your company to Notion with comprehensive resources and recurring knowledge transfer sessions.",
    features: ['Custom workspace design', 'Team onboarding', 'Ongoing support'],
  },
  {
    icon: '💻',
    title: 'Software Products',
    description:
      'Access our suite of web applications with account creation, Notion integrations, and powerful productivity tools.',
    features: ['Web-based tools', 'Notion integration', 'User accounts'],
  },
  {
    icon: '✨',
    title: 'Software Consulting',
    description:
      'Full-stack engineering expertise to build MVPs, solve complex problems, and create any technical architecture you need.',
    features: ['MVP development', 'Custom solutions', 'Full-stack expertise'],
  },
]

const ServicesSection = () => {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section id="services" className={styles.section}>
      <div className={styles.container} ref={ref}>
        <div className={cn(styles.header, styles.reveal, { [styles.visible]: isVisible })}>
          <Text as="h2" variant="headline-lg" className={styles.title}>
            Our Services
          </Text>
          <Text as="p" variant="body-lg-paragraph" className={styles.subtitle}>
            From templates to custom software, we provide everything you need to transform your
            digital workspace.
          </Text>
        </div>

        <div className={styles.grid}>
          {services.map((service, index) => (
            <div
              key={service.title}
              className={cn(styles.card, styles.reveal, { [styles.visible]: isVisible })}
              style={{ transitionDelay: `${150 + index * 100}ms` }}
            >
              <div className={styles.cardHeader}>
                <div className={styles.iconWrapper}>
                  <span className={styles.icon}>{service.icon}</span>
                </div>
                <Text as="h3" variant="headline-sm" className={styles.cardTitle}>
                  {service.title}
                </Text>
                <Text as="p" variant="body-sm-paragraph" className={styles.cardDescription}>
                  {service.description}
                </Text>
              </div>

              <hr className={styles.cardDivider} />

              <div className={styles.cardContent}>
                <ul className={styles.featureList}>
                  {service.features.map((feature) => (
                    <li key={feature} className={styles.featureItem}>
                      <span className={styles.featureDot} />
                      <Text as="span" variant="body-sm">
                        {feature}
                      </Text>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServicesSection
