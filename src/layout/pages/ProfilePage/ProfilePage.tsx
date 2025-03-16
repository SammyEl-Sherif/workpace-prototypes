import { useUser } from '@/hooks'

import styles from './ProfilePage.module.scss'

export const ProfilePage = () => {
  const { user } = useUser()
  return (
    <div>
      <div className={styles.title}>My Profile</div>
      <div className={styles.section}>
        <div className={styles.userInfo}>
          <div className={styles.username}>{user?.name ?? 'No username available'}</div>
          <div className={styles.email}>{user?.email ?? 'Email N/A'}</div>
        </div>
        <div className={styles.roles}>
          <div className={styles.roleHeading}>User Roles</div>
          {user?.roles.map((role: string) => (
            <div key={role} className={styles.role}>
              {role}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
