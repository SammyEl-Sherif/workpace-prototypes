import { Button, Text } from '@workpace/design-system'
import cn from 'classnames'
import Link from 'next/link'

import { Routes } from '@/interfaces/routes'

import { useScrollReveal } from '../../hooks'

import styles from './CTASection.module.scss'

const ButtonComponent = Button as any

interface CTASectionProps {
  onBookConsultation: () => void
}

const CTASection = ({ onBookConsultation }: CTASectionProps) => {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section className={styles.section} ref={ref}>
      <div className={styles.container}>
        <div className={cn(styles.content, styles.reveal, { [styles.visible]: isVisible })}>
          <Text as="h2" variant="headline-lg" className={styles.title}>
            Ready to Transform Your Workspace?
          </Text>
          <Text as="p" variant="body-lg-paragraph" className={styles.subtitle}>
            Whether you need a simple Notion template or a complete custom software solution,
            we&apos;re here to help you work smarter.
          </Text>

          <div
            className={cn(styles.buttons, styles.reveal, { [styles.visible]: isVisible })}
            style={{ transitionDelay: '150ms' }}
          >
            <ButtonComponent variant="default-primary" onClick={onBookConsultation}>
              Schedule a Consultation →
            </ButtonComponent>
            <Link href={Routes.TEMPLATES} className={styles.browseLink}>
              <ButtonComponent as="span" variant="default-secondary" className={styles.outlineBtn}>
                Browse Templates
              </ButtonComponent>
            </Link>
          </div>

          <Text
            as="p"
            variant="body-sm"
            className={cn(styles.disclaimer, styles.reveal, { [styles.visible]: isVisible })}
            style={{ transitionDelay: '250ms' }}
          >
            No commitment required. Let&apos;s chat about your needs.
          </Text>
        </div>
      </div>
    </section>
  )
}

export default CTASection
