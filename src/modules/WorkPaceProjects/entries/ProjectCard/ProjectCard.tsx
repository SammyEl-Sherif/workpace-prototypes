import { ProjectsRecord } from '@/pocketbase-types'

export const ProjectCard: React.FC<ProjectsRecord> = ({ url, title, thumbnail }) => {
  const isProd = process.env.NODE_ENV === 'production'
  return (
    <a href={isProd ? `https://www.workpace.io${url}` : `http://localhost:3000${url}`}>
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
        }}
      >
        {title}
      </div>
    </a>
  )
}
