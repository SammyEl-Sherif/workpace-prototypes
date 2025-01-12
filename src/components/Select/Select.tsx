import { ReactNode } from 'react'

import styles from './Select.module.scss'

interface SelectProps {
  children: ReactNode
  label: string
}

export const Select = ({ children, label }: SelectProps) => {
  return (
    <div className={styles.container}>
      <h3>
        <label>{label}</label>
      </h3>
      <select className={styles.select}>{children}</select>
    </div>
  )
}
