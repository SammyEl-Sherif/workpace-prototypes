import { useRef, useState } from 'react'

import { Button, Text } from '@workpace/design-system'

import styles from './GenerateReportUserPromptInput.module.scss'
import { AllPages, GeneratedReport } from '../../entries'
import { useGenerateReport, useNotionDatabasePages } from '../../hooks'
import ReactLoading from 'react-loading'
import { SectionContainer } from '@/components'

export const GenerateReportUserPromptInput = () => {
  const [userPrompt, setUserPrompt] = useState<string>()
  const { pages } = useNotionDatabasePages()
  const [response, isLoading, , makeRequest] = useGenerateReport({
    pages: pages ?? [],
    userPrompt,
  })
  const bottomRef = useRef<HTMLDivElement>(null)

  // TODO: find scroll fix - issue is auto scroll on page load with hero component
  /* const hasMounted = useRef(false);
  useEffect(() => {
    if (hasMounted.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      hasMounted.current = true;
    }
  }, [isLoading]) */

  return (
    <div>
      <SectionContainer>
        <AllPages />
        <Text variant={'headline-md-emphasis'}>Enter a Prompt</Text>
        <div className={styles.promptWrapper}>
          <textarea
            className={styles.textarea}
            onChange={(e) => {
              setUserPrompt(e.target.value)
              const target = e.target as HTMLTextAreaElement
              target.style.height = 'auto' // Reset height to auto to calculate new height
              target.style.height = `${target.scrollHeight}px` // Set height based on scrollHeight
            }}
            placeholder={"Describe how you'd like to showcase your accomplishments ..."}
            value={userPrompt}
            rows={1}
          />
          <div className={styles.actions}>
            <Button
              onClick={() => {
                setUserPrompt('Write me a year end review in essay format')
              }}
              variant="default-secondary"
              className={styles.button}
            >
              Year End Review
            </Button>
            <Button
              onClick={() => {
                setUserPrompt(
                  'Consider the requirements for following job description and advocate for how I fit the role: <Paste Job Requirements Here>'
                )
              }}
              variant="default-secondary"
              className={styles.button}
            >
              Interview Prep
            </Button>
            <Button
              onClick={() => {
                setUserPrompt('Summarize my accomplishments with a list of bullet points')
              }}
              variant="default-secondary"
              className={styles.button}
            >
              Bullet Points
            </Button>
            <div
              className={`${styles.submitButton}`}
              onClick={() => {
                makeRequest()
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 256 256"
                className={styles.svgIcon}
              >
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm45.66-77.66a8,8,0,0,1-11.32,11.32L128,115.31,93.66,149.66a8,8,0,0,1-11.32-11.32l40-40a8,8,0,0,1,11.32,0Z"></path>
              </svg>
            </div>
          </div>
        </div>
      </SectionContainer>
      <div className={styles.arrow}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          fill="#000000"
          viewBox="0 0 256 256"
        >
          <path d="M213.66,130.34a8,8,0,0,1,0,11.32l-80,80a8,8,0,0,1-11.32,0l-80-80a8,8,0,0,1,11.32-11.32L128,204.69l74.34-74.35A8,8,0,0,1,213.66,130.34Zm-91.32,11.32a8,8,0,0,0,11.32,0l80-80a8,8,0,0,0-11.32-11.32L128,124.69,53.66,50.34A8,8,0,0,0,42.34,61.66Z"></path>
        </svg>
      </div>
      <div ref={bottomRef} />
      <SectionContainer>
        {isLoading ? (
          <div className={styles.loading}>
            <ReactLoading type="spin" color="#1983EE" height={'30%'} width={'30%'} />
          </div>
        ) : (
          <GeneratedReport response={response} mocked={false} />
        )}
      </SectionContainer>
    </div>
  )
}
