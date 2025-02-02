import { useEffect, useState } from 'react'

import { useNotionDatabaseContext } from '@/modules/AccomplishmentReport/contexts'
import { ProjectsRecord } from '@/pocketbase-types'

import { ProjectCard } from '../../entries'
import { useProjects } from '../../hooks'

export const ProjectsGrid = () => {
  const [clientSideProjects] = useProjects()
  const [projectList, setProjectList] = useState<ProjectsRecord[] | []>([])

  useEffect(() => {
    setProjectList(clientSideProjects ?? [])
  }, [clientSideProjects])

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
