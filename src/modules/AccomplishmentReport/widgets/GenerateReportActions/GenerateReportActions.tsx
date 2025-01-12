import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints'

import { Select } from '@/components/Select'
import { NotionDatabase } from '@/interfaces/notion'

import styles from './GenerateReportActions.module.scss'
import { AllAccomplishmentsModal } from '../../features'


type GenerateReportActionsProps = {
  accomplishments: QueryDatabaseResponse[]
  databases: NotionDatabase[]
}

const GenerateReportActions = ({ accomplishments, databases }: GenerateReportActionsProps) => {
  return (
    <div className={styles.actions}>
      <Select label="Notion Database:">
        {Array.isArray(databases) &&
          databases.map((db: NotionDatabase) => <option key={db.id}>{db.title}</option>)}
      </Select>
      <AllAccomplishmentsModal accomplishments={accomplishments} />
    </div>
  )
}

export default GenerateReportActions
