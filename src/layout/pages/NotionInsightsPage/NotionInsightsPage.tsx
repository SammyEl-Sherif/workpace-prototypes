import { GeneratedReport } from '@/modules/AccomplishmentReport/entries'
import {
  GenerateReportActions,
  GenerateReportUserPromptInput,
} from '@/modules/AccomplishmentReport/widgets'
import { HomePageProps } from '@/pages'

import styles from './NotionInsights.module.scss'

const NotionInsights = ({
  props: { accomplishments, response, mocked, databases },
}: HomePageProps) => {
  return (
    <div className={styles.page}>
      <GenerateReportActions accomplishments={accomplishments} databases={databases} />
      <div className={styles.section} id="generate-report-user-prompt">
        <GenerateReportUserPromptInput />
      </div>
      <div className={styles.section} id="generated-report">
        <GeneratedReport response={response} mocked={mocked} />
      </div>
    </div>
  )
}

export default NotionInsights
