import { NotionDatabase } from '@/interfaces/notion'
import {
  CommentSection,
  GenerateReportActions,
  GenerateReportUserPromptInput,
  LearnMore,
} from '@/modules/AccomplishmentReport/widgets'

import styles from './NotionInsights.module.scss'
import { SectionContainer } from '@/components'

export interface NotionInsightsPageProps {
  databases: NotionDatabase[]
}

const NotionInsights = () => {
  return (
    <div className={styles.page}>
      <SectionContainer>
        <h1 style={{ fontSize: '32px' }}>🥇 The Good Stuff List</h1>
        <LearnMore />
      </SectionContainer>
      <SectionContainer>
        <h1 style={{ fontSize: '32px' }}>Report Generator</h1>
        <GenerateReportActions />
        <GenerateReportUserPromptInput />
      </SectionContainer>
      <CommentSection />
    </div>
  )
}

export default NotionInsights
