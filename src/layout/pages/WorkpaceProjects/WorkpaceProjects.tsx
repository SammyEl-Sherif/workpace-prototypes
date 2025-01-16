import styles from './WorkpaceProjects.module.scss'

type WorkpaceProjectsProps = {
  projects: string[]
}

type ProjectProps = {
  name: string
}
const Project: React.FC<ProjectProps> = ({ name }) => {
  return (
    <a href={name}>
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

const WorkpaceProjects = ({ projects }: WorkpaceProjectsProps) => {
  return (
    <div className={styles.page}>
      <div className={styles.section} id="generate-report-user-prompt">
        <h1>WorkPace Projects</h1>
        <div style={{ display: 'flex', flexFlow: 'row wrap', justifyContent: 'left' }}>
          {projects.map((project) => {
            return <Project key={project} name={project} />
          })}
        </div>
      </div>
    </div>
  )
}

export default WorkpaceProjects
