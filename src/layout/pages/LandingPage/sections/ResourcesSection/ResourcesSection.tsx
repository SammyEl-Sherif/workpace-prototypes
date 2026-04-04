import { motion } from 'framer-motion'

import styles from './ResourcesSection.module.scss'

const resources = [
  {
    title: 'Tutorials',
    description: 'Step-by-step guides to master Notion and AI workflows.',
    cta: 'Watch Tutorials →',
    href: '#',
  },
  {
    title: 'Blog',
    description: 'Insights, strategies, and updates from the WorkPace team.',
    cta: 'Read the Blog →',
    href: '#',
  },
]

const ResourcesSection = () => {
  return (
    <section className={styles.section}>
      <motion.span
        className={styles.eyebrow}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        Learn More
      </motion.span>
      <motion.h2
        className={styles.heading}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
      >
        Resources to Level Up Your Workflow
      </motion.h2>
      <motion.p
        className={styles.subtext}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
      >
        Learn how to use Notion and AI agents in your workflow today.
      </motion.p>
      <div className={styles.grid}>
        {resources.map((resource, index) => (
          <motion.div
            key={resource.title}
            className={styles.card}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 + index * 0.1 }}
          >
            <h3 className={styles.cardTitle}>{resource.title}</h3>
            <p className={styles.cardDescription}>{resource.description}</p>
            <a href={resource.href} className={styles.cardCta}>
              {resource.cta}
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default ResourcesSection
