import { useCallback, useState } from 'react'

import { Button } from '@workpace/design-system'

import { PageSummary } from '@/interfaces/notion'

import styles from './GenerateReportUserPromptInput.module.scss'
import { GeneratedReport } from '../../entries'
import { useGenerateReport } from '../../hooks'
type GenerateReportUserPromptInputProps = {
  accomplishments: PageSummary[]
}
const GenerateReportUserPromptInput = ({ accomplishments }: GenerateReportUserPromptInputProps) => {
  const generateReport = useGenerateReport({ accomplishments })
  const [reportResult, setReportResult] = useState<string | null>(null)

  const handleGenerateReport = useCallback(async () => {
    const [result, error] = await generateReport({ data: accomplishments })
    if (error) {
      console.log('[ERROR] Generate Report failed ...', error)
    } else {
      setReportResult(result?.data.response ?? null)
    }
  }, [accomplishments])

  return (
    <div>
      <p style={{ marginBottom: '8px' }}>
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
          placeholder="Write me a year end self reflection report I can submit to my manager."
        />
        <div className={styles.buttonRight}>
          <Button
            label="Generate Report"
            primary={true}
            size="small"
            onClick={handleGenerateReport}
          />
        </div>
      </div>
      <GeneratedReport response={reportResult} mocked={false} />
    </div>
  )
}

export default GenerateReportUserPromptInput
