import { useAppsContext } from '@/modules'
import { useRouter } from 'next/router'
import styles from './AppHeading.module.scss'
import { Badge } from '../Badge'
import { Text } from '@workpace/design-system'

export const AppHeading = ({ title }: { title?: string }) => {
  const { apps } = useAppsContext()
  const { pathname } = useRouter()
  const currentApp = apps.find((app) => app.path === pathname)
  const currentAppTech = currentApp?.tech
  const techStack = currentAppTech?.split(',').map((tech) => tech.trim())

  return (
    <div>
      <div className={styles.wrapper}>
        <Text variant={'headline-display-emphasis'} className={styles.title}>
          {title}
        </Text>
        <div className={styles.badgeGroup}>
          {techStack?.map((technology, index) => (
            <Badge key={index}>{technology}</Badge>
          ))}
        </div>
      </div>
      {currentApp?.description && (
        <div className={styles.description}>{currentApp.description}</div>
      )}
    </div>
  )
}
