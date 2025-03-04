import { Prototype } from '@/interfaces/prototypes'

import styles from './ProjectCard.module.scss'

export const ProjectCard: React.FC<Prototype> = ({ path, name, description }) => {
  const isProd = process.env.NODE_ENV === 'production'
  return (
    <a href={isProd ? `https://workpace.io${path}` : `http://localhost:3000${path}`}>
      <div className={styles.card}>
        <div className={styles.description}>{description}</div>
        <div>{name}</div>
      </div>
    </a>
  )
}
