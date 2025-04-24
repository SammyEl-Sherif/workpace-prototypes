import { ExternalLink } from '@/components'
import { StatusSelectFilter } from '../../features'
import { useNotionDatabasePages } from '../../hooks'
import { Text } from '@workpace/design-system'
import styles from './AllPages.module.scss'
import { useNotionDatabaseContext } from '../../contexts'

export const AllPages = () => {
  const {
    state: { databases },
  } = useNotionDatabaseContext()
  const { pages } = useNotionDatabasePages()
  return (
    <div>
      <div className={styles.actions}>
        <div className={styles.titleAndFilter}>
          <Text variant={'headline-md-emphasis'}>Tasks ({pages.length})</Text>
          <StatusSelectFilter />
        </div>
        <div className={styles.selectedDb}>
          <Text variant={'headline-sm-emphasis'}>Selected Database:</Text>
          <ExternalLink
            external
            href="https://work-pace.notion.site/1c76838c67878105aa7cddf4d95fa59a?v=1c76838c6787809e89d5000cf1ad7803"
          >
            <h3>{databases?.length ? databases[0].title : 'Database N/A'}</h3>
          </ExternalLink>
        </div>
      </div>
      <div className={styles.taskList}>
        {Array.isArray(pages) &&
          pages.map((item, i) => (
            <div className={styles.task} key={i}>
              <Text as="div" variant={'body-lg-emphasis'}>
                Title: {(item as any).title}
              </Text>
              <Text as="div">Type: {(item as any).accomplishmentType}</Text>
            </div>
          ))}
      </div>
    </div>
  )
}
