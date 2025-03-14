import styles from './ProfilePage.module.scss'

export const ProfilePage = () => {
  return (
    <div className={styles.section}>
      <div className={styles.title}>My Profile</div>
      <div className={styles.subtitle}>
        Welcome to WorkPace&apos;s prototyping environment, where we test products designed to bring
        a change of pace to your online workspace.
      </div>
    </div>
  )
}
