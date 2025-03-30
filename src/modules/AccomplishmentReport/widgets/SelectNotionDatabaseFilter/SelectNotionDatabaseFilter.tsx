import { useMemo, useRef } from 'react'

import { DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { Select } from '@workpace/design-system'

import styles from './Select.module.scss'
import { useNotionDatabaseInfo } from '../../hooks'
import { useNotionDatabaseContext } from '@/modules/AccomplishmentReport/contexts'
import { PropertyType } from 'notion-types'

interface SelectProps {
  label: string
}

const usePropertyType = (
  properties: DatabaseObjectResponse['properties'],
  selectedProperty: string
): PropertyType | null => {
  const propertyType = useMemo(() => {
    return properties[selectedProperty]?.type
  }, [selectedProperty])
  return selectedProperty ? (propertyType as PropertyType | null) : null
}

export const SelectNotionDatabaseFilter = ({ label }: SelectProps) => {
  const {
    update,
    state: { database_id, filters },
  } = useNotionDatabaseContext()
  const { response } = useNotionDatabaseInfo({ database_id: database_id ?? '' })

  const property = useRef<string>()
  const propertyValue = useRef<string>('Accomplishment')

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
    propertyValue.current = JSON.parse(event.target.value)
    update({
      filters: {
        property: property.current ?? '',
        status: {
          equals: propertyValue.current,
        },
      },
    })
  }

  const filterName =
    filters && 'property' in filters
      ? filters.property
      : Array.isArray(response?.properties) && response?.properties.length > 0
      ? response.properties[0].name
      : ''
  const propertyType = usePropertyType(response?.properties ?? {}, filterName ?? '')

  return (
    <div className={styles.container}>
      <div className={styles.selectGroup}>
        <Select
          label={label}
          required
          onChange={handleDbChange}
          className={styles.select}
          defaultValue={''}
        >
          {response?.properties &&
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            Object.entries(response.properties).map(([key, prop]: [string, any]) => (
              <option key={`${prop.id}-${key}`} value={JSON.stringify(prop)}>
                {prop.name}
              </option>
            ))}
        </Select>
        {(() => {
          switch (propertyType) {
            case 'status':
              return (
                <Select
                  label={filterName ?? ''}
                  required
                  onChange={handleFilterChange}
                  className={styles.select}
                  defaultValue={''}
                >
                  {filterName &&
                    response?.properties[filterName]?.type === 'status' &&
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    response.properties[filterName].status.options.map((prop: any) => (
                      <option key={prop.id} value={JSON.stringify(prop.name)}>
                        {prop.name}
                      </option>
                    ))}
                </Select>
              )
            default:
              return <div>Unsupported property type: {propertyType}</div>
          }
        })()}
      </div>
    </div>
  )
}
