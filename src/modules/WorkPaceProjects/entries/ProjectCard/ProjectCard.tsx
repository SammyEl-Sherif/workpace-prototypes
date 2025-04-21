import { useUser } from '@/hooks/useUser'
import { Prototype } from '@/interfaces/prototypes'
import { UserGroup } from '@/interfaces/user'

import styles from './ProjectCard.module.scss'

export const ProjectCard: React.FC<Prototype> = ({ path, name, description, stage }) => {
  const isProd = process.env.NODE_ENV === 'production'
  const { user } = useUser()
  const isWorkpaceAdmin = user?.roles.includes(UserGroup.Admin)

  return isWorkpaceAdmin ? (
    <a href={isProd ? `https://workpace.io${path}` : `http://localhost:3000${path}`}>
      <div className={styles.card}>
        <div className={styles.description}>{description}</div>
        <div>{name}</div>
        {/* <div className={styles.badgeAndTitle}>
          <div className={styles.badge}>{stage}</div>
        </div> */}
      </div>
    </a>
  ) : (
    <div className={styles.cardDisabled}>
      <div className={styles.descriptionDisabled}>This prototype is not available yet.</div>
      <div>{name} 🔒</div>
    </div>
  )
}
