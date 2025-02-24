import { useEffect, useState } from 'react'

import { ProjectsRecord } from '@/pocketbase-types'

import styles from './ProjectsGrid.module.scss'
import { ProjectCard } from '../../entries'
import { useProjects } from '../../hooks'

export const ProjectsGrid = () => {
  const [clientSideProjects] = useProjects(true)
  const [projectList, setProjectList] = useState<ProjectsRecord[] | []>([])

  useEffect(() => {
    if (clientSideProjects && clientSideProjects !== projectList) {
      setProjectList(clientSideProjects)
    }
  }, [])

  return (
    <div>
      <div
        style={{
          display: 'flex',
          paddingTop: '5vh',
          fontSize: '32px',
          justifyContent: 'left',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        Prototypes
      </div>
      <div
        style={{
          display: 'flex',
          fontSize: '18px',
          marginBottom: '16px',
        }}
      >
        Welcome to WorkPace&apos;s prototyping environment, where we seek to bring a change of pace
        to your online workspace. Test ideas, share your feedback, and watch products evolve.
      </div>
      <div className={styles.grid}>
        {projectList.map((project: ProjectsRecord, index) => {
          return <ProjectCard key={index} {...project} />
        })}
      </div>
    </div>
  )
}
