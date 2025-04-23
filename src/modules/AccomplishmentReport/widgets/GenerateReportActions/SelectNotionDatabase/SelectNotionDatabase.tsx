import { ReactNode } from 'react'

import { Select } from '@workpace/design-system'

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
        <Select
          label={label}
          onChange={handleDbChange}
          defaultValue={defaultValue}
          className={styles.select}
          required
        >
          {children}
        </Select>
      </div>
    </div>
  )
}
