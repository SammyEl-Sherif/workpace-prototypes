import { Button, Text } from '@workpace/design-system'
import { motion } from 'framer-motion'
import Link from 'next/link'

import { Routes } from '@/interfaces/routes'

import styles from './CTASection.module.scss'

const ButtonComponent = Button as any

interface CTASectionProps {
  onBookConsultation: () => void
}

const CTASection = ({ onBookConsultation }: CTASectionProps) => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <Text as="h2" variant="headline-lg" className={styles.title}>
              Ready to Transform Your Workspace?
            </Text>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          >
            <Text as="p" variant="body-lg-paragraph" className={styles.subtitle}>
              Whether you need a simple Notion template or a complete custom software solution,
              we&apos;re here to help you work smarter.
            </Text>
          </motion.div>

          <motion.div
            className={styles.buttons}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          >
            <ButtonComponent variant="default-primary" onClick={onBookConsultation}>
              Schedule a Consultation →
            </ButtonComponent>
            <Link href={Routes.TEMPLATES} className={styles.browseLink}>
              <ButtonComponent as="span" variant="default-secondary" className={styles.outlineBtn}>
                Browse Templates
              </ButtonComponent>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
          >
            <Text as="p" variant="body-sm" className={styles.disclaimer}>
              No commitment required. Let&apos;s chat about your needs.
            </Text>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default CTASection
