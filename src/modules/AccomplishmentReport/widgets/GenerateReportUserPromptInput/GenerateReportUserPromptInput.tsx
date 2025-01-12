import { Button } from '@workpace/design-system'

import styles from './GenerateReportUserPromptInput.module.scss'

const GenerateReportUserPromptInput = () => {
  const handleGenerateReport = () => {}
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
    </div>
  )
}

export default GenerateReportUserPromptInput
