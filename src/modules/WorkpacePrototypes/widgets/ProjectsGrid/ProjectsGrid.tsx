import { motion } from 'framer-motion'

import { Prototype } from '@/interfaces/prototypes'

import { usePrototypesContext } from '../../contexts'
import { ProjectCard } from '../../entries'
import styles from './ProjectsGrid.module.scss'

export const ProjectsGrid = () => {
  const { prototypes } = usePrototypesContext()

  return (
    <div className={styles.page}>
      {/* Header */}
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className={styles.title}>Prototypes</h1>
        <p className={styles.subtitle}>
          Products designed to bring a change of pace to your online workspace. Explore what
          we&apos;re building.
        </p>
      </motion.div>

      {/* Grid */}
      {prototypes && prototypes.length > 0 ? (
        <div className={styles.grid}>
          {prototypes.map((prototype: Prototype, index) => (
            <ProjectCard prototype={prototype} index={index} key={prototype.path} />
          ))}
        </div>
      ) : (
        <motion.div
          className={styles.empty}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p>No prototypes available yet. Check back soon.</p>
        </motion.div>
      )}
    </div>
  )
}
