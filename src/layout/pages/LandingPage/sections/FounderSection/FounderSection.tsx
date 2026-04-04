import { motion } from 'framer-motion'

import styles from './FounderSection.module.scss'

const FounderSection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <motion.div
          className={styles.imageColumn}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <img src="/IMG_9078.png" alt="Sammy" className={styles.photo} />
        </motion.div>

        <div className={styles.textColumn}>
          <motion.span
            className={styles.eyebrow}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            Meet the Founder
          </motion.span>
          <motion.h2
            className={styles.heading}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          >
            Hey, I&apos;m Sammy
          </motion.h2>
          <motion.hr
            className={styles.divider}
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: 60 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.15 }}
          />
          <div className={styles.body}>
            <motion.p
              className={styles.paragraph}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            >
              I&apos;m a full-stack software engineer passionate about showing people the difference
              technology can make when it&apos;s tailored to their goals.
            </motion.p>
            <motion.p
              className={styles.paragraph}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
            >
              I&apos;ve been obsessed with using Notion as a tool for achieving my own goals for the
              last 6 years, and it&apos;s what helped me learn how to code.
            </motion.p>
            <motion.p
              className={styles.paragraph}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
            >
              Whether it&apos;s business or personal, I love helping people build systems that
              actually move the needle.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FounderSection
