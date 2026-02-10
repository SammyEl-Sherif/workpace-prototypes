import { Text } from '@workpace/design-system'
import cn from 'classnames'
import Image from 'next/image'

import { useScrollReveal } from '../../hooks'

import styles from './FeaturesSection.module.scss'

const features = [
  {
    icon: '🗄️',
    title: 'All-in-One Platform',
    description:
      'Build a comprehensive knowledge base with Notion as your central hub, enabling seamless collaboration across your entire team.',
  },
  {
    icon: '⚡',
    title: 'Workflow Automation',
    description:
      "We identify what's automatable in your business and implement smart solutions that save time and reduce errors.",
  },
  {
    icon: '🧠',
    title: 'AI Agent Integration',
    description:
      'Leverage intelligent agents to handle repetitive tasks and provide insights, letting your team focus on what matters.',
  },
  {
    icon: '🔒',
    title: 'Custom Software',
    description:
      'From client portals to data analytics suites, we build tailored solutions that integrate perfectly with your workflow.',
  },
]

const FeaturesSection = () => {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section id="features" className={styles.section} ref={ref}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Text content */}
          <div
            className={cn(styles.textContent, styles.revealLeft, { [styles.visible]: isVisible })}
          >
            <Text as="h2" variant="headline-lg" className={styles.title}>
              Built for Modern Teams
            </Text>
            <Text as="p" variant="body-lg-paragraph" className={styles.subtitle}>
              WorkPace combines the power of Notion with custom software development to create
              solutions that truly transform how your team works.
            </Text>

            <div className={styles.featureList}>
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className={cn(styles.feature, styles.revealLeft, {
                    [styles.visible]: isVisible,
                  })}
                  style={{ transitionDelay: `${200 + index * 100}ms` }}
                >
                  <div className={styles.featureIcon}>
                    <span>{feature.icon}</span>
                  </div>
                  <div className={styles.featureText}>
                    <Text as="h3" variant="headline-sm" className={styles.featureTitle}>
                      {feature.title}
                    </Text>
                    <Text as="p" variant="body-md-paragraph" className={styles.featureDescription}>
                      {feature.description}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div
            className={cn(styles.imageWrapper, styles.revealRight, {
              [styles.visible]: isVisible,
            })}
            style={{ transitionDelay: '200ms' }}
          >
            <div className={styles.imageContainer}>
              <Image
                src="https://images.unsplash.com/photo-1617042375876-a13e36732a04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMGRldmVsb3BlciUyMGNvZGluZ3xlbnwxfHx8fDE3NzA2MTEyMDB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Software development workspace"
                width={1080}
                height={810}
                className={styles.image}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
