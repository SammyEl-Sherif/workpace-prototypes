import { SectionContainer } from '@/components'
import styles from './About.module.scss'

export const HomePage = () => {
  return (
    <SectionContainer>
      <div className={styles.title}>About Us</div>
      <div className={styles.subtitle}>
        Welcome to WorkPace&apos;s prototyping environment, where we test products designed to bring
        a change of pace to your online workspace.
      </div>
      <div className={styles.title}>Our Tech Stack</div>
      <div className={styles.title}>Our Favorite Tools</div>
      <div className={styles.title}>Get In Touch</div>
    </SectionContainer>
  )
}
