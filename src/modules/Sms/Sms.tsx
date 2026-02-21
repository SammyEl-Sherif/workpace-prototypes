import { AppPageLayout } from '@/layout'
import { Text } from '@workpace/design-system'

import { ChiefOfStaffDatabaseSelector } from './components/ChiefOfStaffDatabaseSelector'
import styles from './Sms.module.scss'

export const Sms = () => {
  const phoneNumber = '+16505093842'
  const displayPhoneNumber = '+1 (650) 509-3842'
  const messageBody = 'outlook'
  const smsLink = `sms:${phoneNumber}?body=${encodeURIComponent(messageBody)}`

  return (
    <AppPageLayout
      breadcrumbs={[{ label: 'Integrations', href: '/integrations' }, { label: 'Chief of Staff' }]}
      title="Chief of Staff"
      titleContent={
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Chief of Staff</h1>
          <Text as="p" variant="body-lg" className={styles.subtitle}>
            Text &quot;outlook&quot; to{' '}
            <a href={smsLink} className={styles.phoneLink}>
              {displayPhoneNumber}
            </a>{' '}
            to receive your morning task summary from your selected Notion databases.
          </Text>
        </div>
      }
    >
      <div className={styles.chiefOfStaffSection}>
        <ChiefOfStaffDatabaseSelector />
      </div>
    </AppPageLayout>
  )
}
