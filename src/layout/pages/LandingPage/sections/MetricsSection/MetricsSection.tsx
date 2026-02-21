import { useEffect, useState } from 'react'

import { motion } from 'framer-motion'

import styles from './MetricsSection.module.scss'

const metrics = [
  { value: '5+', label: 'Business Workspaces Built', wide: true },
  { value: '100+', label: 'Template Downloads' },
  { value: '50+', label: 'Automated Workflows' },
  { value: '5+', label: 'AI Integrations' },
  { value: '10+', label: 'In-depth Tutorials' },
  { value: '25+', label: 'Success Stories', full: true },
]

export const MetricsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % metrics.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>WorkPace by the Numbers</h2>
        <div className={styles.grid}>
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              className={`${styles.tile} ${metric.wide ? styles.tileWide : ''} ${
                metric.full ? styles.tileFull : ''
              } ${activeIndex === index ? styles.active : ''}`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.span
                className={styles.value}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
              >
                {metric.value}
              </motion.span>
              <span className={styles.label}>{metric.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
