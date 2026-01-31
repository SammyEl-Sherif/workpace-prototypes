import { usePrototypesContext } from '@/modules'
import { useRouter } from 'next/router'
import styles from './PrototypeHeading.module.scss'
import { Badge } from '../Badge'
import { Text } from '@workpace/design-system'

export const PrototypeHeading = ({ title }: { title?: string }) => {
  const { prototypes } = usePrototypesContext()
  const { pathname } = useRouter()
  const currentPrototype = prototypes.find((prototype) => prototype.path === pathname)
  const currentPrototypeTech = currentPrototype?.tech
  const techStack = currentPrototypeTech?.split(',').map((tech) => tech.trim())

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
      {currentPrototype?.description && (
        <div className={styles.description}>{currentPrototype.description}</div>
      )}
    </div>
  )
}
