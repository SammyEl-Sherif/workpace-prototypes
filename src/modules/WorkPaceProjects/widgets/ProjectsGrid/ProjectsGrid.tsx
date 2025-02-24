import { useEffect, useState } from 'react'

import { ProjectsRecord } from '@/pocketbase-types'

import { ProjectCard } from '../../entries'
import { useProjects } from '../../hooks'

export const ProjectsGrid = () => {
  const [clientSideProjects] = useProjects()
  const [projectList, setProjectList] = useState<ProjectsRecord[] | []>([])

  useEffect(() => {
    setProjectList(clientSideProjects ?? [])
  }, [clientSideProjects])

  if (Array.isArray(projectList) && projectList.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          height: '25vh',
          fontSize: '28px',
          justifyContent: 'left',
          alignItems: 'center',
        }}
      >
        Hello, there are no awesome ideas for you to review yet, come back soonish ...
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        flexFlow: 'row wrap',
        justifyContent: 'left',
        marginTop: '35px',
        marginBottom: '35px',
      }}
    >
      {Array.isArray(projectList) &&
        projectList.map((project: ProjectsRecord, index) => {
          return <ProjectCard key={index} {...project} />
        })}
    </div>
  )
}
