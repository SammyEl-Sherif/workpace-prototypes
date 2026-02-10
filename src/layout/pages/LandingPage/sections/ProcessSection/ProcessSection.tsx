import { Text } from '@workpace/design-system'
import cn from 'classnames'

import { useScrollReveal } from '../../hooks'

import styles from './ProcessSection.module.scss'

const steps = [
  {
    icon: '💬',
    title: 'Understand Your Needs',
    description:
      'We start by diving deep into your business, understanding your pain points and workflows.',
  },
  {
    icon: '💡',
    title: 'Design Solutions',
    description:
      "Our team crafts tailored solutions, whether it's a Notion workspace or custom software.",
  },
  {
    icon: '🚀',
    title: 'Build & Deploy',
    description: 'We develop and implement your solution with precision and attention to detail.',
  },
  {
    icon: '🤝',
    title: 'Support & Iterate',
    description: 'Ongoing support and knowledge transfer ensure your team maximizes the value.',
  },
]

const ProcessSection = () => {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section id="process" className={styles.section} ref={ref}>
      <div className={styles.container}>
        <div className={cn(styles.header, styles.reveal, { [styles.visible]: isVisible })}>
          <Text as="h2" variant="headline-lg" className={styles.title}>
            How We Work
          </Text>
          <Text as="p" variant="body-lg-paragraph" className={styles.subtitle}>
            Our proven process ensures you get exactly what you need, delivered with excellence.
          </Text>
        </div>

        <div className={styles.grid}>
          {steps.map((step, index) => (
            <div
              key={step.title}
              className={cn(styles.step, styles.reveal, { [styles.visible]: isVisible })}
              style={{ transitionDelay: `${200 + index * 120}ms` }}
            >
              <div className={styles.stepIcon}>
                <span className={styles.icon}>{step.icon}</span>
                <div className={styles.stepNumber}>{index + 1}</div>
              </div>
              <Text as="h3" variant="headline-sm" className={styles.stepTitle}>
                {step.title}
              </Text>
              <Text as="p" variant="body-md-paragraph" className={styles.stepDescription}>
                {step.description}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProcessSection
