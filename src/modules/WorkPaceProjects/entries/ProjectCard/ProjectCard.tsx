import { ProjectsRecord } from '@/pocketbase-types'

export const ProjectCard: React.FC<ProjectsRecord> = ({ url, title, thumbnail }) => {
  const isProd = process.env.NODE_ENV === 'production'
  return (
    <a href={isProd ? `https://workpace.io${url}` : `http://localhost:3000${url}`}>
      <div
        style={{
          minWidth: '300px',
          minHeight: '350px',
          backgroundColor: 'black',
          color: 'white',
          borderRadius: '8px',
          border: 'solid black 1px',
          textAlign: 'left',
          alignContent: 'flex-end',
          padding: '2rem 1.5rem',
          fontSize: '22px',
        }}
      >
        {title}
      </div>
    </a>
  )
}
