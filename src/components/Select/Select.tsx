import { ReactNode } from 'react'

import styles from './Select.module.scss'

interface SelectProps {
  children: ReactNode
}

export const Select = ({ children }: SelectProps) => {
  return <select className={styles.select}>{children}</select>
}
