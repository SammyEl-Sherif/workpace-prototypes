import ReactMarkdown from 'react-markdown'

import { HomePageProps } from '@/pages'

import styles from './NotionInsights.module.scss'

const NotionInsights = ({ props: { title, accomplishments, response, mocked } }: HomePageProps) => {
  return (
    <div className={styles.page}>
      <div className={styles.sectionHero} id="hero-section">
        <div className={styles.headingWrapper}>
          <h1 className={styles.heading}>The Good Stuff List 🏆</h1>
          <h2 className={styles.headingSecondary}>Notion Database: {title}</h2>
        </div>
      </div>
      <div className={styles.section} id="all-accomplishments-insights">
        <h3 style={{ marginBottom: '10px' }}>Accomplishments ({accomplishments.length})</h3>
        <div>
          <p>Front End Development (#): </p>
          <p>Back End Development (#): </p>
          <p>Data Engineering (#): </p>
        </div>
        {Array.isArray(accomplishments) &&
          accomplishments.map((item, i) => (
            <p style={{ padding: '10px' }} key={i}>
              <span>
                {i + 1}. {(item as any).title} |{' '}
              </span>
              <span>{(item as any).accomplishmentType}</span>
            </p>
          ))}
      </div>
      <div className={styles.section} id="automated-year-end-review">
        <ReactMarkdown>{response}</ReactMarkdown>
        <div>Mocked Response: {mocked.toString()}</div>
      </div>
    </div>
  )
}

export default NotionInsights
