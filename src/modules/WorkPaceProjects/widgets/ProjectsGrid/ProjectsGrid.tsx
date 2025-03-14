import { Prototype } from '@/interfaces/prototypes'

import styles from './ProjectsGrid.module.scss'
import { usePrototypesContext } from '../../contexts'
import { ProjectCard } from '../../entries'

export const ProjectsGrid = () => {
  const {
    state: { prototypes },
  } = usePrototypesContext()

  return (
    <div>
      <div className={styles.title}>Prototypes</div>
      <div className={styles.subtitle}>
        Welcome to WorkPace&apos;s prototyping environment, where we test products designed to bring
        a change of pace to your online workspace.
      </div>
      <div className={styles.grid}>
        {prototypes.map((prototype: Prototype, index) => {
          return (
            <ProjectCard
              path={prototype.path}
              description={prototype?.description}
              name={prototype.name}
              key={index}
              icon={prototype.icon}
            />
          )
        })}
      </div>
    </div>
  )
}
