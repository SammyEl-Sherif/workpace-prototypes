import styles from './GenerateReportActions.module.scss'
import { AllAccomplishmentsModal, StatusSelectFilter } from '../../features'
import { useNotionDatabaseContext } from '../../contexts'
import { ExternalLink } from '@/components'

const GenerateReportActions = () => {
  const {
    state: { databases },
  } = useNotionDatabaseContext()
  return (
    <div className={styles.container}>
      <div className={styles.actions}>
        <div className={styles.selectedDb}>
          <h3>Selected Database:</h3>
          <ExternalLink
            external
            href="https://work-pace.notion.site/1c76838c67878105aa7cddf4d95fa59a?v=1c76838c6787809e89d5000cf1ad7803"
          >
            <h3>{databases?.length ? databases[0].title : 'Database N/A'}</h3>
          </ExternalLink>
        </div>
        <StatusSelectFilter />
        {/* TODO: Implement dynamic property filter <SelectNotionDatabaseFilter /> */}
      </div>
      <AllAccomplishmentsModal />
    </div>
  )
}

export default GenerateReportActions
