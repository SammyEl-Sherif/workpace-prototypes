import { useState } from 'react'

import { Button } from '@workpace/design-system'

import styles from './GenerateReportUserPromptInput.module.scss'
import { GeneratedReport } from '../../entries'
import { useGenerateReport, useNotionDatabasePages } from '../../hooks'
import { Loading } from '@/components/Loading'

const GenerateReportUserPromptInput = () => {
  const [userPrompt, setUserPrompt] = useState<string>()
  const { pages } = useNotionDatabasePages()
  const [response, isLoading, , makeRequest] = useGenerateReport({
    pages: pages ?? [],
    userPrompt,
  })

  return (
    <div>
      <p style={{ marginBottom: '12px' }}>
        Tell me how you&apos;d like to showcase your accomplishments, and I&apos;ll craft a
        professional report.
      </p>
      <div className={styles.promptWrapper}>
        <textarea
          style={{
            backgroundColor: 'white',
            color: 'black',
            padding: '8px',
            border: 'solid gray 1px',
            borderRadius: '2px',
            flexGrow: 1,
            boxShadow: '1px 1px 5px rgba(0, 0, 0, 0.2)',
            height: '72px',
          }}
          onChange={(e) => setUserPrompt(e.target.value)}
          placeholder="Write me a year end self reflection report I can submit to my manager."
        />
        <div className={styles.buttonRight}>
          <Button
            variant={'default-primary'}
            onClick={() => {
              makeRequest()
            }}
          >
            Generate Report
          </Button>
        </div>
      </div>
      {response && <hr style={{ marginTop: '20px', marginBottom: '5px' }} />}
      {isLoading ? <Loading /> : <GeneratedReport response={response} mocked={false} />}
      {response && <hr style={{ marginTop: '5px' }} />}
    </div>
  )
}

export default GenerateReportUserPromptInput
