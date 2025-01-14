import ReactMarkdown from 'react-markdown'

import styles from './GeneratedReport.module.scss'
type GeneratedReportProps = {
  response: string | null
  mocked: boolean
}

const GeneratedReport = ({ response }: GeneratedReportProps) => {
  return (
    <div className={styles.container}>
      <ReactMarkdown
        className={styles.container}
        components={{
          p: ({ node, ...props }) => <p style={{ padding: '10px 0' }} {...props} />,
        }}
      >
        {response}
      </ReactMarkdown>
    </div>
  )
}

export default GeneratedReport
