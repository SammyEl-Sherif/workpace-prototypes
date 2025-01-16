import { ReactNode } from 'react'

import { useNotionDatabaseContext } from '@/modules/AccomplishmentReport/contexts'

import styles from './Select.module.scss'

interface SelectProps {
  children: ReactNode
  label: string
  defaultValue?: string
}

export const SelectNotionDatabase = ({ children, label, defaultValue }: SelectProps) => {
  const { update } = useNotionDatabaseContext()
  const handleDbChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    update({ database_id: event.target.value })
  }
  return (
    <div className={styles.container}>
      <div style={{ position: 'relative' }}>
        <h3 style={{ fontSize: '12px', position: 'absolute', top: '-16px' }}>
          <label>{label}</label>
        </h3>
        <select onChange={handleDbChange} defaultValue={defaultValue} className={styles.select}>
          {children}
        </select>
      </div>
    </div>
  )
}
