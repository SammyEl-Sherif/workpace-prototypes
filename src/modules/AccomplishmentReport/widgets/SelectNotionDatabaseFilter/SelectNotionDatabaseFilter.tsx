import { useMemo, useRef } from 'react'

import { Select } from '@workpace/design-system'

import styles from './Select.module.scss'
import { useNotionDatabaseInfo } from '../../hooks'
import { useNotionDatabaseContext } from '@/modules/AccomplishmentReport/contexts'
import Loading from 'react-loading'
import { PropertyType } from '@/interfaces/notion'

const supportedPropertyTypes = ['status', 'select']

export const SelectNotionDatabaseFilter = () => {
  const {
    update,
    state: { database_id, filters },
  } = useNotionDatabaseContext()

  const { response, isLoading } = useNotionDatabaseInfo({ database_id: database_id ?? '' })
  const property = useRef<string>('')
  const propertyValue = useRef<string>('')

  const filterName = useMemo(() => {
    return filters && 'property' in filters
      ? filters.property
      : Array.isArray(response?.properties) && response?.properties.length > 0
      ? response.properties[0].name
      : ''
  }, [response?.properties, filters])
  const propertyType = response?.properties[filterName]?.type ?? ''

  const handlePropertyChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    propertyType: PropertyType
  ) => {
    /* when the property changes, select the first option */
    let propOptionChoice = ''
    property.current = JSON.parse(event.target.value).name
    propOptionChoice =
      propertyType === 'select' || propertyType === 'status'
        ? response?.properties[property.current][propertyType]?.options[0]?.name
        : ''
    update({
      filters: {
        property: property.current ?? '',
        [propertyType]: {
          equals: propertyValue.current ?? propOptionChoice,
        },
      },
    })
  }

  const handleFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    propertyType: PropertyType
  ) => {
    propertyValue.current = JSON.parse(event.target.value)
    update({
      filters: {
        property: property.current ?? '',
        [propertyType]: {
          equals: propertyValue.current,
        },
      },
    })
  }

  if (isLoading) {
    return <Loading />
  }
  return (
    <div className={styles.container}>
      <div className={styles.selectGroup}>
        <Select
          label="Filter by"
          required
          onChange={(event) => handlePropertyChange(event, propertyType)}
          className={styles.select}
        >
          {response?.properties &&
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            Object.entries(response.properties).map(([key, prop]: [string, any]) => (
              <option
                key={`${prop.id}-${key}`}
                disabled={!supportedPropertyTypes.includes(prop.type)}
                value={JSON.stringify(prop)}
              >
                {prop.name}
              </option>
            ))}
        </Select>
        {(() => {
          switch (propertyType) {
            case 'select':
              return (
                <Select
                  label={filterName ?? ''}
                  required
                  onChange={(event) => handleFilterChange(event, propertyType)}
                  className={styles.select}
                >
                  {filterName &&
                    response?.properties[filterName]?.type === 'select' &&
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    response.properties[filterName].select.options.map((prop: any) => (
                      <option key={prop.id} value={JSON.stringify(prop.name)}>
                        {prop.name}
                      </option>
                    ))}
                </Select>
              )
            case 'status':
              return (
                <Select
                  label={filterName ?? ''}
                  required
                  onChange={(event) => handleFilterChange(event, propertyType)}
                  className={styles.select}
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
