import { useUser } from '@/hooks/useUser'
import { Prototype } from '@/interfaces/prototypes'
import { UserGroup } from '@/interfaces/user'
import Link from 'next/link'

import styles from './ProjectCard.module.scss'

export const ProjectCard = ({ prototype }: { prototype: Prototype }) => {
  const { user } = useUser()
  const { path, name, description, permittedRoles } = prototype

  const disableRbac = process.env.NEXT_PUBLIC_DISABLE_RBAC === 'true'

  // Check if user has access to this prototype
  // If no permittedRoles specified, allow access (backward compatibility)
  // If permittedRoles specified, check if user has at least one of the required roles
  const hasAccess =
    disableRbac ||
    !permittedRoles ||
    permittedRoles.length === 0 ||
    (user?.roles && permittedRoles.some((requiredRole) => user.roles.includes(requiredRole)))

  return hasAccess ? (
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
