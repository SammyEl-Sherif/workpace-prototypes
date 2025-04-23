import { ReactNode } from 'react'
import styles from './Badge.module.scss'

export const Badge = ({ children }: { children: ReactNode }) => {
  return <div className={styles.badge}>{children}</div>
}
