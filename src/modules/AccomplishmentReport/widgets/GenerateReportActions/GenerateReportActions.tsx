import styles from './GenerateReportActions.module.scss'
import { AllAccomplishmentsModal } from '../../features'
import { NotionDatabase } from '@/interfaces/notion'
import {
  SelectNotionDatabase,
  SelectNotionDatabaseFilter,
} from '@/modules/AccomplishmentReport/widgets'
import { useNotionDatabaseContext } from '../../contexts'

const GenerateReportActions = () => {
  const {
    state: { databases },
  } = useNotionDatabaseContext()
  return (
    <div className={styles.container}>
      <div className={styles.actions}>
        <SelectNotionDatabase label="Database" defaultValue={`${databases ? databases[0].id : ''}`}>
          {Array.isArray(databases) &&
            databases.map((db: NotionDatabase) => (
              <option key={db.id} value={db.id}>
                {db.title}
              </option>
            ))}
        </SelectNotionDatabase>
        <SelectNotionDatabaseFilter label="Properties" />
      </div>
      <AllAccomplishmentsModal />
    </div>
  )
}

export default GenerateReportActions
