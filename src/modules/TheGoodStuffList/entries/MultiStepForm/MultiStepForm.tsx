import { Button, InputField, Text } from '@workpace/design-system'
import styles from './MultiStepForm.module.scss'
import cn from 'classnames'
import { useRef, useState } from 'react'
import { AllPages } from '../AllPages'
import { SectionContainer } from '@/components'
import ReactLoading from 'react-loading'
import { GeneratedReport } from '../GeneratedReport'
import { useGenerateReport, useNotionDatabasePages } from '../../hooks'

const Step = ({ title, index, current }: { title: string; index: number; current: number }) => {
  return (
    <div className={styles.step}>
      <div className={cn(styles.circle, { [styles.active]: current === index })}>
        <Text variant={'body-lg-emphasis'}>{index}</Text>
      </div>
      <Text variant={'body-lg-emphasis'}>{title}</Text>
    </div>
  )
}

const FieldSet = ({ title, label }: { title: string; label: string }) => {
  return (
    <div className={styles.fieldSet}>
      <Text as="div" className={styles.fieldSetTitle} variant={'headline-md-emphasis'}>
        {title}
      </Text>
      <InputField required className={styles.fieldSet} label={label} />
    </div>
  )
}

export const MultiStepForm = () => {
  const [userPrompt, setUserPrompt] = useState<string>()
  const { pages } = useNotionDatabasePages()
  const [response, isLoading, , makeRequest] = useGenerateReport({
    pages: pages ?? [],
    userPrompt,
  })
  const bottomRef = useRef<HTMLDivElement>(null)
  const [currentStep, setCurrentStep] = useState(1)
  return (
    <div className={styles.container}>
      <div className={styles.nav}>
        <Step index={1} current={currentStep} title="Choose Tasks" />
        <Step index={2} current={currentStep} title="Define Good" />
        <Step index={3} current={currentStep} title="Generate" />
      </div>
      <div className={styles.content}>
        {currentStep === 1 ? <AllPages /> : null}
        {currentStep === 2 ? (
          <>
            <Text as="div" variant={'body-lg-emphasis'} marginBottom={200}>
              Specify the different requirements for how your work should be evaluted.
            </Text>
            <div className={styles.fields}>
              <FieldSet title="Technical Breadth / Depth" label="" />
              <InputField label="Span of Influence" />
              <InputField label="Scope of Impact" />
              <InputField label="Mentoring" />
              <InputField label="Tech Community Involvement" />
              <InputField label="Commitment to Learning and Growth" />
            </div>
          </>
        ) : null}
        {currentStep === 3 ? (
          <>
            <>
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
            </>
            {/* <div className={styles.arrow}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                fill="#000000"
                viewBox="0 0 256 256"
              >
                <path d="M213.66,130.34a8,8,0,0,1,0,11.32l-80,80a8,8,0,0,1-11.32,0l-80-80a8,8,0,0,1,11.32-11.32L128,204.69l74.34-74.35A8,8,0,0,1,213.66,130.34Zm-91.32,11.32a8,8,0,0,0,11.32,0l80-80a8,8,0,0,0-11.32-11.32L128,124.69,53.66,50.34A8,8,0,0,0,42.34,61.66Z"></path>
              </svg>
            </div> */}
            <div ref={bottomRef} />
            <div>
              {isLoading ? (
                <div className={styles.loading}>
                  <ReactLoading type="spin" color="#1983EE" height={'30%'} width={'30%'} />
                </div>
              ) : (
                <GeneratedReport response={response} mocked={false} />
              )}
            </div>
          </>
        ) : null}
      </div>
      <div className={styles.actions}>
        <Button
          variant={'default-secondary'}
          onClick={() => currentStep !== 1 && setCurrentStep(currentStep - 1)}
        >
          Back
        </Button>
        <Button
          variant={'default-primary'}
          onClick={() => currentStep !== 3 && setCurrentStep(currentStep + 1)}
        >
          Next Step
        </Button>
      </div>
    </div>
  )
}
