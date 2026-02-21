import { motion } from 'framer-motion'

import styles from './QuoteSection.module.scss'

export const QuoteSection = () => {
  return (
    <section className={styles.quote}>
      <motion.blockquote
        className={styles.text}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        &ldquo;You do not rise to the level of your goals. You fall to the level of your
        systems.&rdquo;
        <motion.span
          className={styles.attribution}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
        >
          &mdash; James Clear
        </motion.span>
      </motion.blockquote>
    </section>
  )
}
