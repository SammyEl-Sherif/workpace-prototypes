import { ProjectsGrid } from '@/modules'

import styles from './WorkpaceProjects.module.scss'

const WorkpaceProjects = () => {
  return (
    <div className={styles.section} id="generate-report-user-prompt">
      <ProjectsGrid />
    </div>
  )
}

export default WorkpaceProjects
