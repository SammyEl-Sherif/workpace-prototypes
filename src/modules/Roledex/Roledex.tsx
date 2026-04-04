import { AppPageLayout } from '@/layout'
import { Text } from '@workpace/design-system'
import { useState } from 'react'

import { ContactUpdater } from './components/ContactUpdater'
import { RoledexDatabaseSelector } from './components/RoledexDatabaseSelector'
import styles from './Roledex.module.scss'

export const Roledex = () => {
  const [hasDatabase, setHasDatabase] = useState(false)

  return (
    <AppPageLayout
      breadcrumbs={[{ label: 'Integrations', href: '/integrations' }, { label: 'Roledex' }]}
      title="Roledex"
      titleContent={
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Roledex</h1>
          <Text as="p" variant="body-lg" className={styles.subtitle}>
            Manage your Notion contacts with natural language. Use prompts to add or update contact
            details automatically.
          </Text>
        </div>
      }
    >
      <div className={styles.section}>
        <RoledexDatabaseSelector onDatabaseChange={setHasDatabase} />
      </div>
      <div className={styles.section}>
        <ContactUpdater hasDatabase={hasDatabase} />
      </div>
    </AppPageLayout>
  )
}
