import ReactMarkdown from 'react-markdown'
import { Text } from '@workpace/design-system'

import styles from './GeneratedReport.module.scss'
type GeneratedReportProps = {
  response: string | null
  mocked: boolean
}

const GeneratedReport = ({ response }: GeneratedReportProps) => {
  return (
    <div className={styles.container}>
      <Text variant={'headline-display-emphasis'}>AI Response</Text>
      {response ? (
        <ReactMarkdown
          className={styles.container}
          components={{
            p: ({ node, ...props }) => <p style={{ padding: '10px 0' }} {...props} />,
            h1: ({ node, ...props }) => <h1 style={{ fontSize: '32px' }} {...props} />,
          }}
        >
          {response}
        </ReactMarkdown>
      ) : (
        <div>Click the button in the text box above ...</div>
      )}
    </div>
  )
}

export default GeneratedReport
