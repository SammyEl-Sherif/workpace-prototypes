import { motion } from 'framer-motion'

import { App } from '@/interfaces/apps'

import { useAppsContext } from '../../contexts'
import { ProjectCard } from '../../entries'
import styles from './ProjectsGrid.module.scss'

export const ProjectsGrid = () => {
  const { apps } = useAppsContext()

  return (
    <div className={styles.page}>
      {apps && apps.length > 0 ? (
        <div className={styles.grid}>
          {apps.map((app: App, index) => (
            <ProjectCard app={app} index={index} key={app.path} />
          ))}
        </div>
      ) : (
        <motion.div
          className={styles.empty}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p>No apps available yet. Check back soon.</p>
        </motion.div>
      )}
    </div>
  )
}
