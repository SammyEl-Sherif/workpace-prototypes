import { NotionDatabase, PageSummary } from '@/interfaces/notion'
import {
  SelectNotionDatabase,
  SelectNotionDatabaseFilter,
} from '@/modules/AccomplishmentReport/widgets'

import styles from './GenerateReportActions.module.scss'
import { AllAccomplishmentsModal } from '../../features'

type GenerateReportActionsProps = {
  databases: NotionDatabase[]
  pages: PageSummary[]
}

const GenerateReportActions = ({ databases, pages }: GenerateReportActionsProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.actions}>
        <SelectNotionDatabase label="Notion Database" defaultValue={`${databases[0].id}`}>
          {Array.isArray(databases) &&
            databases.map((db: NotionDatabase) => (
              <option key={db.id} value={db.id}>
                {db.title}
              </option>
            ))}
        </SelectNotionDatabase>
        <SelectNotionDatabaseFilter label="Properties Filter" />
      </div>
      <AllAccomplishmentsModal pages={pages} />
    </div>
  )
}

export default GenerateReportActions
