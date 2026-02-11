import { useManualFetch } from '@/hooks'
import { CreateGoodThingInput } from '@/interfaces/good-things'
import { NotionDatabase, PageSummary } from '@/interfaces/notion'
import { HttpResponse } from '@/server/types'
import { Button, InputField, Loading, Select, Text } from '@workpace/design-system'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './NotionImportModal.module.scss'

interface NotionImportModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: () => void
}

type Step = 'connect' | 'select-database' | 'search-tasks' | 'importing'

export const NotionImportModal = ({ isOpen, onClose, onImport }: NotionImportModalProps) => {
  const router = useRouter()
  const [step, setStep] = useState<Step>('connect')
  const [connectionStatus, setConnectionStatus] = useState<{ connection: any | null } | null>(null)
  const [databases, setDatabases] = useState<NotionDatabase[]>([])
  const [selectedDatabaseId, setSelectedDatabaseId] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [pages, setPages] = useState<PageSummary[]>([])
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check for error messages from OAuth callback
  useEffect(() => {
    if (isOpen) {
      const { error: urlError, message } = router.query
      if (urlError) {
        const errorMessages: Record<string, string> = {
          unauthorized: 'You must be signed in to connect Notion.',
          oauth_error: message
            ? decodeURIComponent(String(message))
            : 'OAuth authorization failed.',
          missing_code: 'Authorization code is missing. Please try again.',
          token_exchange_failed:
            'Failed to exchange authorization code for access token. Please check your Notion OAuth credentials (NOTION_CLIENT_ID and NOTION_CLIENT_SECRET) in your environment variables.',
          save_failed: 'Failed to save Notion connection. Please try again.',
          callback_error: message
            ? decodeURIComponent(String(message))
            : 'An error occurred during OAuth callback.',
        }
        setError(errorMessages[String(urlError)] || 'An error occurred. Please try again.')
        setStep('connect')
      }
    }
  }, [isOpen, router.query])

  const checkConnection = useManualFetch<{ connection: any | null }>('notion/oauth/status')
  const getDatabases = useManualFetch<{ databases: NotionDatabase[] }>('notion/database/list')
  const getPages = useManualFetch<PageSummary[]>('notion/database/pages')
  const bulkImport = useManualFetch<HttpResponse<{ good_things: any[] }>>(
    'good-stuff-list/good-things/bulk'
  )

  // Check connection status on mount
  useEffect(() => {
    if (isOpen) {
      checkConnectionStatus()
    }
  }, [isOpen])

  const checkConnectionStatus = async () => {
    try {
      const [response] = await checkConnection({ method: 'get' })
      if (response?.connection) {
        setConnectionStatus(response)
        setStep('select-database')
        loadDatabases()
      } else {
        setConnectionStatus({ connection: null })
        setStep('connect')
      }
    } catch (err) {
      setError('Failed to check connection status')
      setConnectionStatus({ connection: null })
      setStep('connect')
    }
  }

  const loadDatabases = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [response] = await getDatabases({
        method: 'post',
        data: {},
      })
      if (response?.databases) {
        setDatabases(response.databases)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load databases')
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnect = () => {
    window.location.href = '/api/notion/oauth/authorize'
  }

  const handleDatabaseSelect = async (databaseId: string) => {
    setSelectedDatabaseId(databaseId)
    setStep('search-tasks')
    await searchTasks(databaseId, '')
  }

  const searchTasks = async (databaseId: string, query: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const [response] = await getPages({
        method: 'post',
        data: {
          database_id: databaseId,
          query: query || undefined,
          // Don't pass filter_by_creator - let it filter by creator by default
          // This ensures import modal only shows tasks created by the user
        },
      })
      if (Array.isArray(response)) {
        setPages(response)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to search tasks')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = () => {
    if (selectedDatabaseId) {
      searchTasks(selectedDatabaseId, searchQuery)
    }
  }

  const togglePageSelection = (pageId: string) => {
    setSelectedPages((prev) => {
      const next = new Set(prev)
      if (next.has(pageId)) {
        next.delete(pageId)
      } else {
        next.add(pageId)
      }
      return next
    })
  }

  const handleImport = async () => {
    if (selectedPages.size === 0) {
      setError('Please select at least one task to import')
      return
    }

    setIsLoading(true)
    setError(null)
    setStep('importing')

    try {
      const selectedPageData = pages.filter((p) => p.id && selectedPages.has(p.id))
      const importData: CreateGoodThingInput[] = selectedPageData.map((page) => ({
        title: page.title || 'Untitled',
        description: page.summary || null,
        completion_date: page.completionDate || null,
        goal_id: null,
      }))

      const [response, error] = await bulkImport({
        method: 'post',
        data: importData,
      })

      if (error) {
        console.error('[Notion Import] Bulk import error:', error)
        throw error
      }

      if (response?.data?.good_things) {
        onImport()
        onClose()
        // Reset state
        setSelectedPages(new Set())
        setSearchQuery('')
        setSelectedDatabaseId('')
        setStep('connect')
      } else {
        console.error('[Notion Import] Unexpected response format:', response)
        throw new Error('Unexpected response format from server')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to import tasks')
      setStep('search-tasks')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      await fetch('/api/notion/oauth/disconnect', {
        method: 'DELETE',
        credentials: 'include',
      })
      setConnectionStatus({ connection: null })
      setStep('connect')
      setDatabases([])
      setSelectedDatabaseId('')
      setPages([])
      setSelectedPages(new Set())
    } catch (err) {
      setError('Failed to disconnect')
    }
  }

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && step !== 'importing') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose, step])

  if (!isOpen) return null

  const modalContent = (
    <div className={styles.modalOverlay} onClick={step !== 'importing' ? onClose : undefined}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.headerInfo}>
            <Text variant="headline-md-emphasis">Import from Notion</Text>
          </div>
          {step !== 'importing' && (
            <Button variant="default-secondary" onClick={onClose}>
              Close
            </Button>
          )}
        </div>

        <div className={styles.modalBody}>
          {error && (
            <div className={styles.error}>
              <Text variant="body-md" color="error-600">
                {error}
              </Text>
            </div>
          )}

          {step === 'connect' && (
            <div className={styles.stepContent}>
              <Text variant="body-md" marginBottom={300}>
                Connect your Notion account to import tasks into your Good Stuff List.
              </Text>
              <Button variant="brand-secondary" onClick={handleConnect} disabled={isLoading}>
                {isLoading ? 'Connecting...' : 'Connect to Notion'}
              </Button>
            </div>
          )}

          {step === 'select-database' && (
            <div className={styles.stepContent}>
              <div className={styles.connectionInfo}>
                {connectionStatus?.connection ? (
                  <div className={styles.connectionStatus}>
                    <span className={styles.statusDot} data-status="connected"></span>
                    <Text variant="body-sm" color="neutral-600">
                      Connected to Notion
                    </Text>
                    <button className={styles.disconnectLink} onClick={handleDisconnect}>
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <div className={styles.connectionStatus}>
                    <span className={styles.statusDot} data-status="disconnected"></span>
                    <Text variant="body-sm" color="neutral-600">
                      Not connected to Notion
                    </Text>
                  </div>
                )}
              </div>
              <Text variant="body-md-emphasis" marginBottom={100}>
                Select a Database to Import
              </Text>
              {isLoading ? (
                <Loading />
              ) : (
                <Select
                  label="Database"
                  value={selectedDatabaseId}
                  onChange={(e) => {
                    if (e.target.value) {
                      handleDatabaseSelect(e.target.value)
                    }
                  }}
                  marginBottom={300}
                >
                  <option value="">Select a database...</option>
                  {databases.map((db) => (
                    <option key={db.id} value={db.id}>
                      {db.title}
                    </option>
                  ))}
                </Select>
              )}
              {databases.length === 0 && !isLoading && (
                <Text variant="body-sm" color="neutral-600">
                  No databases found. Make sure your Notion integration has access to your
                  databases.
                </Text>
              )}
            </div>
          )}

          {step === 'search-tasks' && (
            <div className={styles.stepContent}>
              <div className={styles.searchSection}>
                <InputField
                  label="Search tasks"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch()
                    }
                  }}
                  placeholder="Type to search tasks..."
                />
                <Button variant="brand-secondary" onClick={handleSearch} disabled={isLoading}>
                  Search
                </Button>
              </div>

              {isLoading ? (
                <Loading />
              ) : (
                <>
                  <div className={styles.tasksList}>
                    {pages.length === 0 ? (
                      <Text variant="body-sm" color="neutral-600">
                        No tasks found. Try a different search query.
                      </Text>
                    ) : (
                      pages.map((page) => {
                        const isSelected = page.id ? selectedPages.has(page.id) : false
                        return (
                          <div
                            key={page.id || Math.random()}
                            className={`${styles.taskItem} ${isSelected ? styles.selected : ''}`}
                            onClick={() => page.id && togglePageSelection(page.id)}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => page.id && togglePageSelection(page.id)}
                              className={styles.checkbox}
                            />
                            <div className={styles.taskInfo}>
                              <Text variant="body-md-emphasis">{page.title || 'Untitled'}</Text>
                              {page.summary && (
                                <Text variant="body-sm" color="neutral-600">
                                  {page.summary}
                                </Text>
                              )}
                              {page.completionDate && (
                                <Text variant="body-xs" color="neutral-400">
                                  {new Date(page.completionDate).toLocaleDateString()}
                                </Text>
                              )}
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>

                  {selectedPages.size > 0 && (
                    <div className={styles.importSection}>
                      <Text variant="body-md" marginBottom={200}>
                        {selectedPages.size} task{selectedPages.size !== 1 ? 's' : ''} selected
                      </Text>
                      <div className={styles.importActions}>
                        <Button
                          variant="default-secondary"
                          onClick={() => setStep('select-database')}
                        >
                          Back
                        </Button>
                        <Button
                          variant="brand-secondary"
                          onClick={handleImport}
                          disabled={isLoading}
                        >
                          Import Selected
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {step === 'importing' && (
            <div className={styles.stepContent}>
              <Loading />
              <Text variant="body-md" marginTop={300}>
                Importing {selectedPages.size} task{selectedPages.size !== 1 ? 's' : ''}...
              </Text>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  if (typeof window !== 'undefined') {
    return createPortal(modalContent, document.body)
  }

  return null
}
