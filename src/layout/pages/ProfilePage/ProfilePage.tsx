import { useUser } from '@/hooks'

import styles from './ProfilePage.module.scss'
import { SectionContainer } from '@/components'

export const ProfilePage = () => {
  const { user } = useUser()
  return (
    <div>
      <div className={styles.title}>My Profile</div>
      <SectionContainer>
        <div className={styles.userInfo}>
          <div className={styles.username}>{user?.name ?? 'No username available'}</div>
          <div className={styles.email}>{user?.email ?? 'Email N/A'}</div>
        </div>
        <div className={styles.roles}>
          <div className={styles.roleHeading}>User Roles</div>
          {user?.roles &&
            user?.roles.map((role: string) => (
              <div key={role} className={styles.role}>
                {role}
              </div>
            ))}
        </div>
      </SectionContainer>
    </div>
  )
}
