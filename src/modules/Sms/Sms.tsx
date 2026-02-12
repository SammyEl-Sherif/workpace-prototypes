import { AppPageLayout } from '@/layout'

import { ChiefOfStaffDatabaseSelector } from './components/ChiefOfStaffDatabaseSelector'
import styles from './Sms.module.scss'

export const Sms = () => {
  return (
    <AppPageLayout
      breadcrumbs={[{ label: 'Apps', href: '/apps' }, { label: 'Chief of Staff' }]}
      title="Chief of Staff"
      subtitle='Text "outlook" to +1 (650) 509-3842 to receive your morning task summary from your selected Notion databases.'
    >
      <div className={styles.chiefOfStaffSection}>
        <ChiefOfStaffDatabaseSelector />
      </div>
    </AppPageLayout>
  )
}
