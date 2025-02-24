import { ProjectsRecord } from '@/pocketbase-types'

import styles from './ProjectCard.module.scss'

export const ProjectCard: React.FC<ProjectsRecord> = ({ url, title, description }) => {
  const isProd = process.env.NODE_ENV === 'production'
  return (
    <a href={isProd ? `https://workpace.io${url}` : `http://localhost:3000${url}`}>
      <div className={styles.card}>
        <div className={styles.description}>{description}</div>
        <div>{title}</div>
      </div>
    </a>
  )
}
