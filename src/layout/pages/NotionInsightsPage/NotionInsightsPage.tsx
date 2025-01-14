import {
  GenerateReportActions,
  GenerateReportUserPromptInput,
} from '@/modules/AccomplishmentReport/widgets'
import { HomePageProps } from '@/pages'

import styles from './NotionInsights.module.scss'

const NotionInsights = ({ props: { accomplishments, databases } }: HomePageProps) => {
  return (
    <div className={styles.page}>
      <GenerateReportActions accomplishments={accomplishments} databases={databases} />
      <div className={styles.section} id="generate-report-user-prompt">
        <GenerateReportUserPromptInput accomplishments={accomplishments} />
      </div>
    </div>
  )
}

export default NotionInsights
