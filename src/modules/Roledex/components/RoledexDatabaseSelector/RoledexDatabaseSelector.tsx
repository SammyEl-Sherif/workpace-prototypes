import { useManualFetch } from '@/hooks'
import { NotionDatabase } from '@/interfaces/notion'
import { HttpResponse } from '@/server/types'
import { Button, Loading, Select, Text } from '@workpace/design-system'
import { useEffect, useState } from 'react'
import styles from './RoledexDatabaseSelector.module.scss'

interface RoledexDatabase {
  id: string
  database_id: string
  database_title: string | null
  created_at: string
}

interface RoledexDatabaseSelectorProps {
  onDatabaseChange?: (hasDatabase: boolean) => void
}

export const RoledexDatabaseSelector = ({ onDatabaseChange }: RoledexDatabaseSelectorProps) => {
  const [connectionStatus, setConnectionStatus] = useState<{ connection: any | null } | null>(null)
  const [databases, setDatabases] = useState<NotionDatabase[]>([])
  const [selectedDatabases, setSelectedDatabases] = useState<RoledexDatabase[]>([])
  const [selectedDatabaseId, setSelectedDatabaseId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkConnection = useManualFetch<{ connection: any | null }>('notion/oauth/status')
  const getDatabases = useManualFetch<{ databases: NotionDatabase[] }>('notion/database/list')
  const getSelectedDatabases = useManualFetch<HttpResponse<RoledexDatabase[]>>(
    'roledex/databases'
  )
  const addDatabase = useManualFetch<HttpResponse<RoledexDatabase>>('roledex/databases')
  const removeDatabase = useManualFetch<HttpResponse<void>>('roledex/databases')

  useEffect(() => {
    checkConnectionStatus()
    loadSelectedDatabases()
  }, [])

  useEffect(() => {
    onDatabaseChange?.(selectedDatabases.length > 0)
  }, [selectedDatabases])

  const checkConnectionStatus = async () => {
    try {
      const [response] = await checkConnection({ method: 'get' })
      if (response?.connection) {
        setConnectionStatus(response)
        loadDatabases()
      } else {
        setConnectionStatus({ connection: null })
      }
    } catch (err) {
      setError('Failed to check connection status')
      setConnectionStatus({ connection: null })
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

  const loadSelectedDatabases = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [response] = await getSelectedDatabases({ method: 'get' })
      if (response?.data && Array.isArray(response.data)) {
        setSelectedDatabases(response.data)
      } else {
        setSelectedDatabases([])
      }
    } catch (err: any) {
      setSelectedDatabases([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnect = () => {
    window.location.href = '/api/notion/oauth/authorize?redirect=/apps/roledex'
  }

  const handleAddDatabase = async (databaseId: string) => {
    const database = databases.find((db) => db.id === databaseId)
    if (!database) return

    setIsLoading(true)
    setError(null)
    try {
      const [response, error] = await addDatabase({
        method: 'post',
        data: {
          database_id: databaseId,
          database_title: database.title,
        },
      })
      if (error) {
        setError(error.message || 'Failed to add database')
      } else if (response?.data) {
        await loadSelectedDatabases()
        setSelectedDatabaseId('')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add database')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveDatabase = async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await removeDatabase({
        method: 'delete',
        data: { id },
      })
      await loadSelectedDatabases()
    } catch (err: any) {
      setError(err.message || 'Failed to remove database')
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
      setDatabases([])
      setSelectedDatabases([])
    } catch (err) {
      setError('Failed to disconnect')
    }
  }

  const availableDatabases = databases.filter(
    (db) => !selectedDatabases.some((selected) => selected.database_id === db.id)
  )

  return (
    <div className={styles.selector}>
      <div className={styles.header}>
        <Text as="h3" variant="headline-sm">
          Contacts Database
        </Text>
        <Text variant="body-sm" color="neutral-400" marginTop={100}>
          Select a Notion database to use as your contact directory
        </Text>
      </div>

      {error && (
        <div className={styles.error}>
          <Text variant="body-sm" color="error-400">
            {error}
          </Text>
        </div>
      )}

      {!connectionStatus?.connection ? (
        <div className={styles.connectSection}>
          <Text variant="body-md" color="neutral-300" marginBottom={200}>
            Connect your Notion account to select a contacts database.
          </Text>
          <Button variant="brand-secondary" onClick={handleConnect} disabled={isLoading}>
            {isLoading ? 'Connecting...' : 'Connect to Notion'}
          </Button>
        </div>
      ) : (
        <div className={styles.content}>
          <div className={styles.connectionInfo}>
            <div className={styles.connectionStatus}>
              <span className={styles.statusDot} data-status="connected"></span>
              <Text variant="body-sm" color="neutral-400">
                Connected to Notion
              </Text>
              <div className={styles.connectionActions}>
                <button className={styles.actionLink} onClick={handleConnect}>
                  <span className={styles.actionIcon}>&#x21bb;</span> Update
                </button>
                <button className={styles.actionLinkDanger} onClick={handleDisconnect}>
                  <span className={styles.actionIcon}>&#x2715;</span> Disconnect
                </button>
              </div>
            </div>
          </div>

          {isLoading && databases.length === 0 ? (
            <Loading />
          ) : (
            <>
              {availableDatabases.length > 0 && (
                <div className={styles.addSection}>
                  <Select
                    label="Add Database"
                    dark
                    value={selectedDatabaseId}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value) {
                        handleAddDatabase(value)
                      }
                    }}
                    marginBottom={200}
                  >
                    <option value="">Select a database to add...</option>
                    {availableDatabases.map((db) => (
                      <option key={db.id} value={db.id}>
                        {db.title}
                      </option>
                    ))}
                  </Select>
                </div>
              )}

              {selectedDatabases.length > 0 ? (
                <div className={styles.selectedSection}>
                  <Text variant="body-md-emphasis" color="neutral-white" marginBottom={150}>
                    Selected Databases ({selectedDatabases.length})
                  </Text>
                  <div className={styles.selectedList}>
                    {selectedDatabases.map((selected) => (
                      <div key={selected.id} className={styles.selectedItem}>
                        <Text variant="body-md">
                          {selected.database_title || 'Untitled Database'}
                        </Text>
                        <Button
                          variant="default-secondary"
                          onClick={() => handleRemoveDatabase(selected.id)}
                          disabled={isLoading}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <Text variant="body-sm" color="neutral-400">
                  No databases selected. Add a contacts database above to get started.
                </Text>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
