import { useEffect, useRef, useState } from 'react'

import { Button, Text } from '@workpace/design-system'

import { AllPages } from '../../entries'
import styles from './GenerateReportUserPromptInput.module.scss'

interface GenerateReportUserPromptInputProps {
  onPromptChange?: (prompt: string) => void
  onGenerateReport?: () => void
  userPrompt?: string
  isLoading?: boolean
  showTaskSection?: boolean
  showPromptSection?: boolean
}

export const GenerateReportUserPromptInput = ({
  onPromptChange,
  onGenerateReport,
  userPrompt: externalUserPrompt,
  isLoading: externalIsLoading,
  showTaskSection = true,
  showPromptSection = true,
}: GenerateReportUserPromptInputProps) => {
  const [internalUserPrompt, setInternalUserPrompt] = useState<string>('')
  const [internalIsLoading, setInternalIsLoading] = useState(false)

  // Use external state if provided, otherwise use internal state
  const userPrompt = externalUserPrompt !== undefined ? externalUserPrompt : internalUserPrompt
  const isLoading = externalIsLoading !== undefined ? externalIsLoading : internalIsLoading

  const handlePromptChange = (newPrompt: string) => {
    if (onPromptChange) {
      onPromptChange(newPrompt)
    } else {
      setInternalUserPrompt(newPrompt)
    }
  }

  const handleGenerateReport = () => {
    if (onGenerateReport) {
      onGenerateReport()
    } else {
      setInternalIsLoading(true)
      // Simulate loading for internal state
      setTimeout(() => setInternalIsLoading(false), 2000)
    }
  }

  return (
    <div className={styles.container}>
      {/* Tasks Section */}
      {showTaskSection && (
        <div className={styles.tasksSection}>
          <AllPages />
        </div>
      )}

      {/* Prompt Section */}
      {showPromptSection && (
        <div className={styles.promptSection}>
          <div className={styles.promptHeader}>
            <Text variant={'headline-md-emphasis'}>AI Prompt</Text>
            <div className={styles.promptSubtitle}>Choose a template or write your own prompt</div>
          </div>

          <div className={styles.promptWrapper}>
            <div className={styles.textareaContainer}>
              <textarea
                className={styles.textarea}
                onChange={(e) => {
                  const newPrompt = e.target.value
                  handlePromptChange(newPrompt)

                  // Auto-resize textarea
                  const target = e.target as HTMLTextAreaElement
                  target.style.height = 'auto'
                  target.style.height = `${target.scrollHeight}px`
                }}
                placeholder={"Describe how you'd like to showcase your accomplishments..."}
                value={userPrompt}
                rows={3}
              />
              <div className={styles.textareaFocus}></div>
            </div>

            <div className={styles.promptActions}>
              <div className={styles.presetSection}>
                <div className={styles.presetLabel}>Quick Templates</div>
                <div className={styles.presetButtons}>
                  <Button
                    onClick={() => {
                      handlePromptChange('Write me a year end review in essay format')
                    }}
                    variant="default-secondary"
                    className={styles.presetButton}
                  >
                    📝 Year End Review
                  </Button>
                  <Button
                    onClick={() => {
                      handlePromptChange(
                        'Consider the requirements for following job description and advocate for how I fit the role: <Paste Job Requirements Here>'
                      )
                    }}
                    variant="default-secondary"
                    className={styles.presetButton}
                  >
                    💼 Interview Prep
                  </Button>
                  <Button
                    onClick={() => {
                      handlePromptChange(
                        'Summarize my accomplishments with a list of bullet points'
                      )
                    }}
                    variant="default-secondary"
                    className={styles.presetButton}
                  >
                    📋 Bullet Points
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleGenerateReport}
                variant="default-primary"
                className={styles.generateButton}
                disabled={!userPrompt?.trim() || isLoading}
              >
                {isLoading ? (
                  <div className={styles.loadingButton}>
                    <div className={styles.spinner}></div>
                    <span>Generating...</span>
                  </div>
                ) : (
                  <>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0L9.937 15.5z" />
                      <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                    </svg>
                    Generate Report
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
