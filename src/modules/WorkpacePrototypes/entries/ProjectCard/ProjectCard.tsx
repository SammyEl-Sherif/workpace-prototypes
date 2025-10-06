import { useUser } from '@/hooks/useUser'
import { Prototype } from '@/interfaces/prototypes'
import { UserGroup } from '@/interfaces/user'
import Link from 'next/link'

import styles from './ProjectCard.module.scss'

export const ProjectCard = ({ prototype }: { prototype: Prototype }) => {
  const { user } = useUser()
  const { path, name, description } = prototype

  const isWorkpaceAdmin = user?.roles.includes(UserGroup.Admin)
  const disableRbac = process.env.NEXT_PUBLIC_DISABLE_RBAC === 'true'
  const isProd = process.env.NODE_ENV === 'production'

  return isWorkpaceAdmin || disableRbac ? (
    <Link href={path}>
      <div className={styles.card}>
        <div className={styles.description}>{description}</div>
        <div>{name}</div>
      </div>
    </Link>
  ) : (
    <div className={styles.cardDisabled}>
      <div className={styles.descriptionDisabled}>This prototype is not available yet.</div>
      <div>{name} 🔒</div>
    </div>
  )
}
