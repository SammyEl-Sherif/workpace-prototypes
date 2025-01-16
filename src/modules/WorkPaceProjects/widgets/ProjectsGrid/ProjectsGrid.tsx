import { ProjectCard } from '../../entries'
import { useProjects } from '../../hooks'

export const ProjectsGrid = () => {
  const { response } = useProjects()
  const projects = response.response
  console.log(projects)
  return (
    <div style={{ display: 'flex', flexFlow: 'row wrap', justifyContent: 'left' }}>
      {Array.isArray(projects) &&
        projects.map((project) => {
          return (
            <ProjectCard urlPath={project.url} key={project.collectionId} name={project.title} />
          )
        })}
    </div>
  )
}
