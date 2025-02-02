import { ProjectsRecord } from '@/pocketbase-types'

export const ProjectCard: React.FC<ProjectsRecord> = ({ url, title, thumbnail }) => {
  return (
    <a href={`http://localhost:3000${url}`}>
      <div
        style={{
          width: '30vw',
          height: '20vh',
          backgroundColor: 'black',
          color: 'white',
          borderRadius: '8px',
          border: 'solid black 1px',
          textAlign: 'center',
          verticalAlign: 'center',
          alignContent: 'center',
          margin: '3vw',
        }}
      >
        {title}
      </div>
    </a>
  )
}
