import { Select } from '@workpace/design-system'

import styles from './SelectNotionStatus.module.scss'
import { useNotionDatabaseInfo } from '../../hooks'
import { useNotionDatabaseContext } from '@/modules/AccomplishmentReport/contexts'

export const StatusSelectFilter = () => {
  const {
    update,
    state: { database_id },
  } = useNotionDatabaseContext()

  const { response } = useNotionDatabaseInfo({ database_id: database_id ?? '' })

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    update({
      filters: {
        property: 'Status',
        status: {
          equals: JSON.parse(event.target.value),
        },
      },
    })
  }

  return (
    <div className={styles.container}>
      <Select
        label="Filter by Status"
        onChange={(event) => handleFilterChange(event)}
        className={styles.select}
        required
      >
        {response?.properties['Status'] &&
          'status' in response.properties['Status'] &&
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          response.properties['Status'].status.options.map((prop: any) => (
            <option key={prop.id} value={JSON.stringify(prop.name)}>
              {prop.name}
            </option>
          ))}
      </Select>
    </div>
  )
}
