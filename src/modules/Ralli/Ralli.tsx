import { InputField, Text } from '@workpace/design-system'

import styles from './Ralli.module.scss'

export const Ralli = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Text as="h1" variant="headline-display" className={styles.title}>
          Ralli
        </Text>
        <Text as="p" variant="body-lg" className={styles.subtitle}>
          Find deals. Invite friends. Your shortcut to good times.
        </Text>
        <div className={styles.searchContainer}>
          <InputField
            label="Search"
            placeholder="Search for deals, events, or activities..."
            className={styles.searchInput}
          />
        </div>
      </div>
    </div>
  )
}
