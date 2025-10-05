import { useState } from 'react'
import { GenerateReportUserPromptInput } from '@/modules/AccomplishmentReport/widgets'
import { GeneratedReport } from '@/modules/AccomplishmentReport/entries'
import { useGenerateReport, useNotionDatabasePages } from '@/modules/AccomplishmentReport/hooks'

import { PrototypeHeading, SectionContainer } from '@/components'
import { Text } from '@workpace/design-system'
import ReactLoading from 'react-loading'
import styles from './NotionInsights.module.scss'

export const NotionInsights = () => {
  const [userPrompt, setUserPrompt] = useState<string>()
  const { pages } = useNotionDatabasePages()
  const [response, isLoading, , makeRequest] = useGenerateReport({
    pages,
    userPrompt,
  })

  const handlePromptChange = (prompt: string) => {
    setUserPrompt(prompt)
  }

  const handleGenerateReport = () => {
    makeRequest()
  }

  return (
    <div className={styles.page}>
      {/* Floating Header */}
      <div className={styles.floatingHeader}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <h1 className={styles.mainTitle}>🥇 The Good Stuff List</h1>
            <p className={styles.subtitle}>
              Transform your Notion tasks into compelling narratives
            </p>
          </div>
          <div className={styles.statsCard}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{pages.length}</span>
              <span className={styles.statLabel}>Tasks</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{response ? '1' : '0'}</span>
              <span className={styles.statLabel}>Reports</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className={styles.mainGrid}>
        {/* Top Row - Tasks & Generate Report */}
        <div className={styles.topRow}>
          {/* Left Column - Tasks */}
          <div className={styles.leftColumn}>
            <div className={styles.taskCard}>
              <div className={styles.cardHeader}>
                <h3>📋 Your Tasks</h3>
                <div className={styles.taskCount}>{pages.length} items</div>
              </div>
              <div className={styles.taskContent}>
                <GenerateReportUserPromptInput
                  onPromptChange={handlePromptChange}
                  onGenerateReport={handleGenerateReport}
                  userPrompt={userPrompt}
                  isLoading={isLoading}
                  showPromptSection={false}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Generate Report */}
          <div className={styles.rightColumn}>
            <div className={styles.generateCard}>
              <div className={styles.cardHeader}>
                <h3>🎯 Generate Your Report</h3>
                <div className={styles.generateStatus}>
                  {userPrompt ? 'Ready' : 'Waiting for input'}
                </div>
              </div>
              <div className={styles.generateContent}>
                <GenerateReportUserPromptInput
                  onPromptChange={handlePromptChange}
                  onGenerateReport={handleGenerateReport}
                  userPrompt={userPrompt}
                  isLoading={isLoading}
                  showTaskSection={false}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row - AI Report */}
        <div className={styles.bottomRow}>
          <div className={styles.reportCard}>
            <div className={styles.cardHeader}>
              <h3>✨ AI Report</h3>
              <div className={styles.statusIndicator}>
                {isLoading ? (
                  <span className={styles.statusLoading}>Generating...</span>
                ) : response ? (
                  <span className={styles.statusReady}>Ready</span>
                ) : (
                  <span className={styles.statusIdle}>Waiting</span>
                )}
              </div>
            </div>

            <div className={styles.reportContent}>
              {isLoading ? (
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
                  <GeneratedReport response={response} mocked={false} />
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>🎯</div>
                  <h4>Ready to Generate</h4>
                  <p>Use the tools above to create your first report</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      {userPrompt && !isLoading && (
        <div className={styles.floatingAction}>
          <button
            className={styles.fab}
            onClick={handleGenerateReport}
            disabled={!userPrompt?.trim()}
          >
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
            Generate
          </button>
        </div>
      )}
    </div>
  )
}
