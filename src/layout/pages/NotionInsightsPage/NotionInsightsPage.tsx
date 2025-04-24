import { NotionDatabase } from '@/interfaces/notion'
import { GenerateReportUserPromptInput } from '@/modules/AccomplishmentReport/widgets'

import styles from './NotionInsights.module.scss'
import { PrototypeHeading, SectionContainer } from '@/components'

export interface NotionInsightsPageProps {
  databases: NotionDatabase[]
}

const NotionInsights = () => {
  return (
    <div className={styles.page}>
      <SectionContainer border={false}>
        <PrototypeHeading title="🥇 The Good Stuff List" />
        <GenerateReportUserPromptInput />
      </SectionContainer>
    </div>
  )
}

export default NotionInsights
