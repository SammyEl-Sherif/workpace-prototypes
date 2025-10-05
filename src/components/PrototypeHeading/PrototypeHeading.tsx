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
  const techStack = currentPrototypeTech?.split(',')

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
      <div className={styles.description}>
        <strong>The Good Stuff List</strong> is a notion integration which feeds all of the tasks
        you track into ChatGPT, alongside a prompt of your choice. There are presets below
        containing common use cases.
      </div>
    </div>
  )
}
