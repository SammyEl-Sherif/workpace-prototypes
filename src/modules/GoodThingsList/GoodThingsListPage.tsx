import { useGoodThings, useManualFetch, useSavedReports } from '@/hooks'
import { CreateSavedReportInput } from '@/interfaces/saved-reports'
import { Box, Text } from '@workpace/design-system'
import { motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { GoodThingsList, ReportModal, SavedReportsTable } from './components'
import styles from './GoodThingsListPage.module.scss'
import { useGenerateReportFromGoodThings } from './hooks/useGenerateReportFromGoodThings'

const PRESET_PROMPTS = {
  'year-end-review': 'Write me a year end review in essay format',
  'linkedin-experience':
    'Write a professional LinkedIn experience summary highlighting my key accomplishments and impact',
  'job-application':
    'Consider the requirements for following job description and advocate for how I fit the role: <Paste Job Requirements Here>',
}

type ViewType = 'good-things' | 'reports'

export const GoodThingsListPage = () => {
  const { goodThings, isLoading, refetch } = useGoodThings()
  const { savedReports, refetch: refetchSavedReports } = useSavedReports()
  const [activeView, setActiveView] = useState<ViewType>('good-things')
  const [userPrompt, setUserPrompt] = useState<string>()
  const [selectedPreset, setSelectedPreset] = useState<string>('')
  const [response, isLoadingReport, , makeRequest] = useGenerateReportFromGoodThings({
    goodThings,
    userPrompt,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [generatingReportId, setGeneratingReportId] = useState<string | null>(null)
  const [selectedReport, setSelectedReport] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const createSavedReport = useManualFetch<{ data: { saved_report: any } }>(
    'good-stuff-list/saved-reports'
  )

  useEffect(() => {
    refetch()
    refetchSavedReports()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleGenerateReport = async () => {
    setGeneratingReportId('generating') // Set a temporary ID for the loading row
    makeRequest()
    setSaveSuccess(false)
    setSaveError(null)
  }

  const handlePreviewReport = useCallback((report: any) => {
    setSelectedReport(report)
    setIsModalOpen(true)
  }, [])

  // Auto-save and preview when report is generated
  useEffect(() => {
    const autoSaveAndPreview = async () => {
      if (response && !isLoadingReport && generatingReportId === 'generating') {
        if (!response.trim()) return

        setIsSaving(true)
        setSaveError(null)

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
            format: 'markdown',
            prompt_used: userPrompt || null,
          }

          const [result, error] = await createSavedReport({
            method: 'post',
            data: input,
          })

          if (error) throw error

          if (result?.data?.saved_report) {
            setGeneratingReportId(result.data.saved_report.id)
            await refetchSavedReports()
            // Auto-open preview
            setTimeout(() => {
              handlePreviewReport(result.data.saved_report)
            }, 100)
          }
        } catch (err: any) {
          setSaveError(err.message || 'Failed to save report')
          setGeneratingReportId(null)
        } finally {
          setIsSaving(false)
        }
      }
    }
    autoSaveAndPreview()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response, isLoadingReport, generatingReportId, selectedPreset, userPrompt, handlePreviewReport])

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedReport(null)
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
            <button
              type="button"
              className={`${styles.statTile} ${activeView === 'good-things' ? styles.active : ''}`}
              onClick={() => setActiveView('good-things')}
            >
              <span className={styles.statNumber}>{goodThings.length}</span>
              <span className={styles.statLabel}>Good Things</span>
            </button>
            <button
              type="button"
              className={`${styles.statTile} ${activeView === 'reports' ? styles.active : ''}`}
              onClick={() => setActiveView('reports')}
            >
              <span className={styles.statNumber}>{savedReports.length}</span>
              <span className={styles.statLabel}>Reports</span>
            </button>
          </motion.div>
        </div>
      </motion.div>

      <div className={styles.mainGrid}>
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className={`${styles.viewContainer} ${activeView === 'good-things' ? styles.goodThingsView : styles.reportsView
            }`}
        >
          {activeView === 'good-things' ? (
            <GoodThingsList />
          ) : (
            <>
              <div className={styles.reportsViewHeader}>
                <Text variant="headline-md-emphasis">Generate a Report</Text>
                <div className={styles.statusBadge}>
                  {isLoadingReport ? (
                    <span className={styles.statusLoading}>Generating...</span>
                  ) : response ? (
                    <span className={styles.statusReady}>Ready</span>
                  ) : (
                    <span className={styles.statusIdle}>Waiting</span>
                  )}
                </div>
              </div>
              <div className={styles.promptInputContainer}>
                <textarea
                  className={styles.promptTextarea}
                  onChange={(e) => {
                    handlePromptChange(e.target.value)
                    setSelectedPreset('') // Clear preset when user types manually
                    // Auto-resize textarea
                    e.target.style.height = 'auto'
                    e.target.style.height = `${e.target.scrollHeight}px`
                  }}
                  onKeyDown={(e) => {
                    // Allow Enter to submit, Shift+Enter for new line
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      if (userPrompt?.trim() && !isLoadingReport) {
                        handleGenerateReport()
                      }
                    }
                  }}
                  placeholder="Describe how you'd like to showcase your accomplishments..."
                  value={userPrompt || ''}
                  rows={1}
                />
                <div className={styles.promptControls}>
                  <div className={styles.templateDropdown}>
                    <select
                      className={styles.templateSelect}
                      value={selectedPreset}
                      onChange={(e) => handlePresetChange(e.target.value)}
                    >
                      <option value="">Template</option>
                      <option value="year-end-review">Year End Review</option>
                      <option value="linkedin-experience">LinkedIn Experience</option>
                      <option value="job-application">Job Application</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    className={styles.generateArrowButton}
                    onClick={handleGenerateReport}
                    disabled={!userPrompt?.trim() || isLoadingReport}
                  >
                    {isLoadingReport ? (
                      <div className={styles.loadingSpinner}></div>
                    ) : (
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
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className={styles.reportsTableSection}>
                <Box marginBottom={150}>
                  <Text variant="headline-md-emphasis">Saved Reports</Text>
                </Box>
                <SavedReportsTable
                  isLoadingReport={isLoadingReport}
                  generatingReportId={generatingReportId}
                />
              </div>
            </>
          )}
        </motion.div>
      </div>

      <ReportModal isOpen={isModalOpen} onClose={handleCloseModal} report={selectedReport} />
    </div>
  )
}
