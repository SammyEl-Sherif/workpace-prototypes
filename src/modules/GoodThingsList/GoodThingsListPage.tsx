import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GoodThingsList, SavedReportsTable } from './components'
import { GeneratedReport } from '@/modules/AccomplishmentReport/entries'
import { useGoodThings, useManualFetch, useSavedReports } from '@/hooks'
import { useGenerateReportFromGoodThings } from './hooks/useGenerateReportFromGoodThings'
import { Text, Select, Button } from '@workpace/design-system'
import { CreateSavedReportInput } from '@/interfaces/saved-reports'
import styles from './GoodThingsListPage.module.scss'

const PRESET_PROMPTS = {
  'year-end-review': 'Write me a year end review in essay format',
  'linkedin-experience': 'Write a professional LinkedIn experience summary highlighting my key accomplishments and impact',
  'job-application': 'Consider the requirements for following job description and advocate for how I fit the role: <Paste Job Requirements Here>',
}

export const GoodThingsListPage = () => {
  const { goodThings, isLoading, refetch } = useGoodThings()
  const { savedReports, refetch: refetchSavedReports } = useSavedReports()
  const [userPrompt, setUserPrompt] = useState<string>()
  const [selectedPreset, setSelectedPreset] = useState<string>('')
  const [response, isLoadingReport, , makeRequest] = useGenerateReportFromGoodThings({
    goodThings,
    userPrompt,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const createSavedReport = useManualFetch<{ data: { saved_report: any } }>('good-stuff-list/saved-reports')

  useEffect(() => {
    refetch()
    refetchSavedReports()
  }, [])

  const handlePromptChange = (prompt: string) => {
    setUserPrompt(prompt)
  }

  const handlePresetChange = (presetValue: string) => {
    setSelectedPreset(presetValue)
    if (presetValue && presetValue in PRESET_PROMPTS) {
      handlePromptChange(PRESET_PROMPTS[presetValue as keyof typeof PRESET_PROMPTS])
    }
  }

  const handleGenerateReport = () => {
    makeRequest()
    setSaveSuccess(false)
    setSaveError(null)
  }

  const handleSaveReport = async () => {
    if (!response || !response.trim()) {
      setSaveError('No report content to save')
      return
    }

    setIsSaving(true)
    setSaveError(null)
    setSaveSuccess(false)

    try {
      // Generate a default title based on the prompt or preset
      let title = 'Generated Report'
      if (selectedPreset && selectedPreset in PRESET_PROMPTS) {
        const presetLabels: Record<string, string> = {
          'year-end-review': 'Year End Review',
          'linkedin-experience': 'LinkedIn Experience Summary',
          'job-application': 'Job Application Report',
        }
        title = presetLabels[selectedPreset] || title
      } else if (userPrompt) {
        // Use first 50 chars of prompt as title
        title = userPrompt.substring(0, 50).trim()
        if (userPrompt.length > 50) title += '...'
      }

      const input: CreateSavedReportInput = {
        title,
        content: response,
        format: 'markdown', // Default to markdown as requested
        prompt_used: userPrompt || null,
      }

      const [result, error] = await createSavedReport({
        method: 'post',
        data: input,
      })

      if (error) throw error

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
      await refetchSavedReports() // Refresh the saved reports list
    } catch (err: any) {
      setSaveError(err.message || 'Failed to save report')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className={styles.page}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={styles.floatingHeader}
      >
        <div className={styles.headerContent}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className={styles.titleSection}
          >
            <h1 className={styles.mainTitle}>🥇 The Good Stuff List</h1>
            <p className={styles.subtitle}>
              Transform your accomplishments into compelling narratives
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className={styles.statsCard}
          >
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{goodThings.length}</span>
              <span className={styles.statLabel}>Good Things</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{savedReports.length}</span>
              <span className={styles.statLabel}>Reports</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className={styles.mainGrid}>
        <div className={styles.topRow}>
          <GoodThingsList />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className={styles.bottomRow}
        >
          <div className={styles.reportCard}>
            <div className={styles.reportHeader}>
              <div className={styles.reportHeaderLeft}>
                <h3>✨ AI Report</h3>
                <div className={styles.statusIndicator}>
                  {isLoadingReport ? (
                    <span className={styles.statusLoading}>Generating...</span>
                  ) : response ? (
                    <span className={styles.statusReady}>Ready</span>
                  ) : (
                    <span className={styles.statusIdle}>Waiting</span>
                  )}
                </div>
              </div>
              <div className={styles.reportHeaderControls}>
                <div className={styles.promptInputWrapper}>
                  <textarea
                    className={styles.promptTextarea}
                    onChange={(e) => {
                      handlePromptChange(e.target.value)
                      setSelectedPreset('') // Clear preset when user types manually
                    }}
                    placeholder="Describe how you'd like to showcase your accomplishments..."
                    value={userPrompt || ''}
                    rows={2}
                  />
                </div>
                <div className={styles.presetSelectWrapper}>
                  <Select
                    label=""
                    placeholder="Select a template"
                    value={selectedPreset}
                    onChange={(e) => handlePresetChange(e.target.value)}
                  >
                    <option value="year-end-review">Year End Review</option>
                    <option value="linkedin-experience">LinkedIn Experience</option>
                    <option value="job-application">Job Application</option>
                  </Select>
                </div>
                <button
                  type="button"
                  className={styles.generateButton}
                  onClick={handleGenerateReport}
                  disabled={!userPrompt?.trim() || isLoadingReport}
                >
                  {isLoadingReport ? (
                    <span>Generating...</span>
                  ) : (
                    <>
                      <svg
                        width="16"
                        height="16"
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
                      Generate
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className={styles.reportContent}>
              {isLoadingReport ? (
                <div className={styles.loadingState}>
                  <div className={styles.loadingAnimation}>
                    <div className={styles.loadingDot}></div>
                    <div className={styles.loadingDot}></div>
                    <div className={styles.loadingDot}></div>
                  </div>
                  <Text>AI is crafting your report...</Text>
                </div>
              ) : response ? (
                <div className={styles.reportDisplay}>
                  <div className={styles.reportActions}>
                    <Button
                      variant="brand-primary"
                      onClick={handleSaveReport}
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : '💾 Save Report'}
                    </Button>
                    {saveSuccess && (
                      <Text variant="body-sm" color="success-600">
                        Report saved successfully!
                      </Text>
                    )}
                    {saveError && (
                      <Text variant="body-sm" color="urgent-600">
                        {saveError}
                      </Text>
                    )}
                  </div>
                  <GeneratedReport response={response} mocked={false} />
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>🎯</div>
                  <h4>Ready to Generate</h4>
                  <p>Use the controls above to create your first report</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className={styles.reportsTableRow}
        >
          <SavedReportsTable />
        </motion.div>
      </div>
    </div>
  )
}
