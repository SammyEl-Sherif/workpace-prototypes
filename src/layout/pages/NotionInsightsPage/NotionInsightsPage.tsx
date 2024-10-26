import {
  DatabaseObjectResponse,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints'
import OpenAI from 'openai'
import ReactMarkdown from 'react-markdown'

import styles from './NotionInsights.module.scss'

interface MyComponentProps {
  results: QueryDatabaseResponse[]
  title: DatabaseObjectResponse['title']
  response: OpenAI.Chat.Completions.ChatCompletionMessage['content']
}

const NotionInsights = (props: MyComponentProps) => {
  return (
    <div className={styles.page}>
      <div className={styles.sectionHero} id="hero-section">
        <div className={styles.headingWrapper}>
          <h1 className={styles.heading}>The Good Stuff List 🏆</h1>
          <h2 className={styles.headingSecondary}>Notion Database: {props.title[0].plain_text}</h2>
        </div>
      </div>
      <div className={styles.section} id="all-accomplishments-insights">
        <h3 style={{ marginBottom: '10px' }}>Accomplishments ({props.results.length})</h3>
        {/* <div>
          <p>Front End Development (#): </p>
          <p>Back End Development (#): </p>
          <p>Data Engineering (#): </p>
        </div> */}
        {props.results.map((item, i) => (
          <p style={{ padding: '10px' }} key={i}>
            <span>
              {i + 1}. {(item as any).properties.Name.title[0].plain_text} |{' '}
            </span>
            <span>{(item as any).properties.Type.select.name}</span>
          </p>
        ))}
      </div>
      <div className={styles.section} id="automated-year-end-review">
        <ReactMarkdown>{props.response}</ReactMarkdown>
      </div>
      {/* <div className={styles.section} id="automated-resume-section-generator">
        <ReactMarkdown>{props.response}</ReactMarkdown>
      </div> */}
    </div>
  )
}

export default NotionInsights
