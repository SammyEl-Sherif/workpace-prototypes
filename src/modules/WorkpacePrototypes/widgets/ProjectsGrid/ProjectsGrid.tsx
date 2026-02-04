import { Prototype } from '@/interfaces/prototypes'

import { usePrototypesContext } from '../../contexts'
import { ProjectCard } from '../../entries'
import styles from './ProjectsGrid.module.scss'

export const ProjectsGrid = () => {
  const { prototypes } = usePrototypesContext()

  return (
    <div className={styles.container}>
      <div className={styles.title}>Products</div>
      <div className={styles.grid}>
        {prototypes ? (
          prototypes.map((prototype: Prototype, index) => (
            <ProjectCard prototype={prototype} key={index} />
          ))
        ) : (
          <>No Prototypes Available</>
        )}
      </div>
    </div>
  )
}
