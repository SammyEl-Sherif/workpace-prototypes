import { useRef } from 'react'

import { useNotionDatabaseContext } from '@/modules/AccomplishmentReport/contexts'

import styles from './Select.module.scss'
import { useNotionDatabaseInfo } from '../../hooks'

interface SelectProps {
  label: string
}

export const SelectNotionDatabaseFilter = ({ label }: SelectProps) => {
  const {
    update,
    state: { database_id, filters },
  } = useNotionDatabaseContext()
  const { response } = useNotionDatabaseInfo({ database_id: database_id ?? '' })

  const property = useRef<string>()
  const propertyValue = useRef<string>('🏆 Accomplishment')

  const handleDbChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    property.current = JSON.parse(event.target.value).name
    update({
      filters: {
        property: property.current ?? '',
        status: {
          equals: propertyValue.current ?? 'N/A',
        },
      },
    })
  }
  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    propertyValue.current = event.target.value
    update({
      filters: {
        property: property.current ?? '',
        status: {
          equals: event.target.value,
        },
      },
    })
  }

  return (
    <div className={styles.container}>
      <div style={{ position: 'relative' }}>
        <h3 style={{ fontSize: '12px', position: 'absolute', top: '-16px' }}>
          <label>{label}</label>
        </h3>
        <div className={styles.filters}></div>
        <select onChange={handleDbChange} className={styles.select} defaultValue={''}>
          {response?.properties &&
            Object.entries(response.properties).map(([key, prop]: [string, any]) => (
              <option key={prop.id} value={JSON.stringify(prop)}>
                {prop.name}
              </option>
            ))}
        </select>
        {/* {isStatus && (
          <select onChange={handleFilterChange} className={styles.select} defaultValue={''}>
            {isStatus &&
              filters.status.options.map((prop: any) => (
                <option key={prop.id} value={JSON.stringify(prop.name)}>
                  {prop.name}
                </option>
              ))}
          </select>
        )} */}
      </div>
    </div>
  )
}
