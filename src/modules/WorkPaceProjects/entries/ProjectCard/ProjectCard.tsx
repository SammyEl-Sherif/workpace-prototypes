type ProjectProps = {
  name: string
  key: string
  urlPath: string
}

export const ProjectCard: React.FC<ProjectProps> = ({ name, key, urlPath }) => {
  return (
    <a href={`http://localhost:3000${urlPath}`}>
      <div
        style={{
          width: '30vw',
          height: '20vh',
          backgroundColor: 'black',
          color: 'white',
          borderRadius: '10px',
          border: 'solid black 1px',
          textAlign: 'center',
          verticalAlign: 'center',
          alignContent: 'center',
          margin: '3vw',
        }}
      >
        {name}
      </div>
    </a>
  )
}
