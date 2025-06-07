import { NotionDatabase } from '@/interfaces/notion'
import { GenerateReportUserPromptInput } from '@/modules/AccomplishmentReport/widgets'

import styles from './GoodStuffList.module.scss'
import { PrototypeHeading, SectionContainer } from '@/components'

export interface GoodStuffListPageProps {
  databases: NotionDatabase[]
}

const GoodStuffListPage = () => {
  return (
    <div className={styles.page}>
      <SectionContainer border={false}>
        <PrototypeHeading title="🥇 The Good Stuff List" />
        <GenerateReportUserPromptInput />
      </SectionContainer>
    </div>
  )
}

export default GoodStuffListPage
