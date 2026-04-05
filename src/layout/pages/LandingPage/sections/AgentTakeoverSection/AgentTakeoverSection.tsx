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
            A Smarter Way to Work
          </motion.span>
          <motion.h2
            className={styles.heading}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          >
            Offload the Busy Work
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
            Spend less time on mundane tasks and more time on the work that matters most to you. AI
            agents take care of the repetitive stuff so you can focus on what you do best.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
          >
            <Link href={Routes.AGENTS} className={styles.cta}>
              See Our Agents →
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
            <img src="/IMG_7442.png" alt="AI agents working for you" className={styles.image} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AgentTakeoverSection
