import { motion } from 'framer-motion'

import { Prototype } from '@/interfaces/prototypes'

import { usePrototypesContext } from '../../contexts'
import { ProjectCard } from '../../entries'
import styles from './ProjectsGrid.module.scss'

export const ProjectsGrid = () => {
  const { prototypes } = usePrototypesContext()

  return (
    <div className={styles.page}>
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
