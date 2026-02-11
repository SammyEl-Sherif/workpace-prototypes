import { useChallenges, useGoodThings, useManualFetch, useSavedReports } from '@/hooks'
import { GoodThing, GoodThingMedia } from '@/interfaces/good-things'
import { CreateSavedReportInput } from '@/interfaces/saved-reports'
import { Box, Breadcrumbs, Button, Text } from '@workpace/design-system'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  DayGrid,
  GoodThingsList,
  NotionImportModal,
  ReportModal,
  SavedReportsTable,
} from './components'
import styles from './GoodThingsListPage.module.scss'
import { useGenerateReportFromGoodThings } from './hooks/useGenerateReportFromGoodThings'

const PRESET_PROMPTS = {
  'year-end-review':
    'Write a professional, detailed year-end performance review for a manager in essay format. The tone should be reflective, confident, and balanced—highlighting key accomplishments, leadership growth, team impact, and areas for continued development. The essay should feel authentic and well-structured, providing examples that demonstrate strategic thinking, people management, and measurable results.',
  'linkedin-experience':
    'Write a professional LinkedIn experience summary highlighting my key accomplishments and impact',
  'job-application':
    'Consider the requirements for following job description and advocate for how I fit the role: <Paste Job Requirements Here>',
}

type ViewType = 'good-things' | 'reports'

interface GoodThingsListPageProps {
  initialGoodThings?: GoodThing[]
  initialMediaByGoodThingId?: Record<string, GoodThingMedia[]>
}

export const GoodThingsListPage = ({
  initialGoodThings,
  initialMediaByGoodThingId,
}: GoodThingsListPageProps = {}) => {
  const router = useRouter()
  const { goodThings: fetchedGoodThings, isLoading, refetch } = useGoodThings()
  const { challenges, refetch: refetchChallenges } = useChallenges()

  // Use initial data from server-side props if available, otherwise fall back to client fetch
  const goodThings = initialGoodThings ?? fetchedGoodThings
  const { savedReports, refetch: refetchSavedReports } = useSavedReports()

  // Filter active challenges (not ended yet)
  const activeChallenges = useMemo(() => {
    return challenges.filter((challenge) => {
      const endDate = new Date(challenge.end_date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return endDate >= today
    })
  }, [challenges])
  const [activeView, setActiveView] = useState<ViewType>('good-things')
  const [userPrompt, setUserPrompt] = useState<string>()
  const [selectedPreset, setSelectedPreset] = useState<string>('')
  const [selectedGoalId, setSelectedGoalId] = useState<string>('all')

  // Filtered good things based on selected goal (shared between DayGrid & GoodThingsList)
  const filteredGoodThings = useMemo(() => {
    if (selectedGoalId === 'all') return goodThings
    return goodThings.filter((gt) => gt.goal_id === selectedGoalId)
  }, [goodThings, selectedGoalId])
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
  const [showHistory, setShowHistory] = useState(false)
  const [addFormOpen, setAddFormOpen] = useState(false)
  const [isNotionImportOpen, setIsNotionImportOpen] = useState(false)
  const createSavedReport = useManualFetch<{ data: { saved_report: any } }>(
    'good-stuff-list/saved-reports'
  )

  // Handle OAuth callback errors/success from URL params
  useEffect(() => {
    const { error, notion_connected } = router.query

    if (notion_connected === 'true') {
      setIsNotionImportOpen(true)
      // Clean up URL
      router.replace('/apps/good-stuff-list', undefined, { shallow: true })
    } else if (error) {
      setIsNotionImportOpen(true)
      // Clean up URL
      router.replace('/apps/good-stuff-list', undefined, { shallow: true })
    }
  }, [router.query, router])

  useEffect(() => {
    refetch()
    refetchSavedReports()
    refetchChallenges()
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
  }, [
    response,
    isLoadingReport,
    generatingReportId,
    selectedPreset,
    userPrompt,
    handlePreviewReport,
  ])

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedReport(null)
  }

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumbsWrapper}>
        <Breadcrumbs
          linkAs={Link}
          items={[{ label: 'Apps', href: '/apps' }, { label: 'Good Stuff List' }]}
          size="lg"
        />
      </div>
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

      {activeView === 'good-things' ? (
        <>
          <DayGrid
            goodThings={goodThings}
            onRefetch={refetch}
            showHistory={showHistory}
            onToggleHistory={() => setShowHistory((prev) => !prev)}
            onAddGoodThing={() => setAddFormOpen(true)}
            selectedGoalId={selectedGoalId}
            onGoalChange={setSelectedGoalId}
            initialMediaByGoodThingId={initialMediaByGoodThingId}
            onImportFromNotion={() => setIsNotionImportOpen(true)}
          >
            {/* History content — rendered inside DayGrid when showHistory is true */}
            <div className={styles.mainGrid}>
              <GoodThingsList
                addFormOpen={addFormOpen}
                onAddFormClose={() => setAddFormOpen(false)}
                goodThings={filteredGoodThings}
              />
            </div>
          </DayGrid>
        </>
      ) : (
        <div className={styles.mainGrid}>
          <motion.div
            key="reports"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className={`${styles.viewContainer} ${styles.reportsView}`}
          >
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
                  setSelectedPreset('')
                  e.target.style.height = 'auto'
                  e.target.style.height = `${e.target.scrollHeight}px`
                }}
                onKeyDown={(e) => {
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
          </motion.div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className={styles.challengesSection}
      >
        <div className={styles.challengesHeader}>
          <div className={styles.challengesHeaderTop}>
            <div className={styles.challengesHeaderText}>
              <Text variant="headline-md-emphasis">Challenges</Text>
              <Text variant="body-md" color="neutral-600">
                Track your progress and stay accountable with challenges
              </Text>
            </div>
            <div className={styles.challengesHeaderControls}>
              <Link href="/apps/good-stuff-list/challenges">
                <Button variant="brand-secondary">View All Challenges</Button>
              </Link>
            </div>
          </div>
        </div>
        {activeChallenges.length > 0 && (
          <div className={styles.challengesList}>
            {activeChallenges.map((challenge) => {
              const endDate = new Date(challenge.end_date)
              const today = new Date()
              today.setHours(0, 0, 0, 0)
              const daysLeft = Math.max(
                0,
                Math.floor((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
              )
              return (
                <Link
                  key={challenge.id}
                  href={`/apps/good-stuff-list/challenges/${challenge.id}`}
                  className={styles.challengeItem}
                >
                  <Text variant="body-md-emphasis" className={styles.challengeName}>
                    {challenge.name}
                  </Text>
                  {challenge.task_description && (
                    <Text variant="body-sm" color="neutral-700" className={styles.challengeTask}>
                      <Text as="span" variant="body-sm-emphasis">
                        Daily Task:{' '}
                      </Text>
                      {challenge.task_description}
                    </Text>
                  )}
                  {daysLeft > 0 && (
                    <Text variant="body-sm" color="neutral-600">
                      {daysLeft} days left
                    </Text>
                  )}
                </Link>
              )
            })}
          </div>
        )}
      </motion.div>

      <ReportModal isOpen={isModalOpen} onClose={handleCloseModal} report={selectedReport} />
      <NotionImportModal
        isOpen={isNotionImportOpen}
        onClose={() => setIsNotionImportOpen(false)}
        onImport={() => {
          refetch()
          setIsNotionImportOpen(false)
        }}
      />
    </div>
  )
}
