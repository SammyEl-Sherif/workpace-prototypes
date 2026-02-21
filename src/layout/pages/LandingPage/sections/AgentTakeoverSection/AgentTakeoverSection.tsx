import { motion } from 'framer-motion'
import Link from 'next/link'

import { Routes } from '@/interfaces/routes'

import styles from './AgentTakeoverSection.module.scss'

const AgentTakeoverSection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.textColumn}>
          <motion.span
            className={styles.eyebrow}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            The Future of Work
          </motion.span>
          <motion.h2
            className={styles.heading}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          >
            The Agent Takeover Is Here
          </motion.h2>
          <motion.hr
            className={styles.divider}
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: 60 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.15 }}
          />
          <motion.p
            className={styles.body}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          >
            AI agents are here, whether you&apos;re ready or not. We&apos;ve entered a new wave of
            technology, and those who leverage it fastest will pull ahead.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
          >
            <Link href={Routes.APPS} className={styles.cta}>
              See Our AI Services →
            </Link>
          </motion.div>
        </div>

        <motion.div
          className={styles.imageColumn}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
        >
          <div className={styles.imageFrame}>
            <img src="/IMG_7442.png" alt="AI Agent Takeover" className={styles.image} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AgentTakeoverSection
