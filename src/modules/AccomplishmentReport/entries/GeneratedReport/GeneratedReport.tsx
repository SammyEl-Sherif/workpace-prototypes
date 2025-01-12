import ReactMarkdown from 'react-markdown'

import styles from './GeneratedReport.module.scss'
type GeneratedReportProps = {
  response: string | null
  mocked: boolean
}

const GeneratedReport = ({ response }: GeneratedReportProps) => {
  console.log('response', response)
  return (
    <div className={styles.container}>
      <ReactMarkdown>{response}</ReactMarkdown>
    </div>
  )
}

export default GeneratedReport
