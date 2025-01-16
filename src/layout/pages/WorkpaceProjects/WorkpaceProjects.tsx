import { ProjectsGrid } from '@/modules'
import styles from './WorkpaceProjects.module.scss'

const WorkpaceProjects = () => {
  return (
    <div className={styles.page}>
      <div className={styles.section} id="generate-report-user-prompt">
        <h1>WorkPace Projects</h1>
        <ProjectsGrid />
      </div>
    </div>
  )
}

export default WorkpaceProjects
