import { useState } from 'react'

import { Button } from '@workpace/design-system'
import ReactLoading from 'react-loading'

import { PageSummary } from '@/interfaces/notion'

import styles from './GenerateReportUserPromptInput.module.scss'
import { GeneratedReport } from '../../entries'
import { useGenerateReport } from '../../hooks'

type GenerateReportUserPromptInputProps = {
  pages: PageSummary[] | null
}

const GenerateReportUserPromptInput = ({ pages }: GenerateReportUserPromptInputProps) => {
  const [userPrompt, setUserPrompt] = useState<string>()
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
            border: 'solid black 1px',
            borderRadius: '4px',
            flexGrow: 1,
            boxShadow: '1px 1px 5px rgba(0, 0, 0, 0.3)',
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
      {isLoading ? (
        <div className={styles.loading}>
          <ReactLoading
            type="spin"
            color="#1983EE"
            height={'40%'}
            width={'40%'}
            className={styles.loader}
          />
        </div>
      ) : (
        <GeneratedReport response={response} mocked={false} />
      )}
      {response && <hr style={{ marginTop: '5px' }} />}
    </div>
  )
}

export default GenerateReportUserPromptInput
