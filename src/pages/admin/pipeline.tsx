import { FormEvent, useCallback, useState } from 'react'
import { GetServerSideProps } from 'next'

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  InputField,
  Select,
  Text,
} from '@workpace/design-system'

import { AppPageLayout } from '@/layout'
import { DocumentTitle } from '@/layout/DocumentTitle'
import { useFetch, useManualFetch } from '@/hooks'
import { withPageRequestWrapper } from '@/server/utils'

import styles from './pipeline.module.scss'

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async () => {
  return {}
})

const MEETING_LINK = 'https://calendar.notion.so/meet/sammyel-sherif/workpace'

interface PipelineResponse {
  data: { threadId: string; result: unknown }
  status: number
}

interface Thread {
  thread_id: string
  client_email?: string
  client_name?: string
  status: string
  created_at: string
}

interface ThreadsResponse {
  data: { threads: Thread[] }
}

interface ThreadStatus {
  data: {
    state: Record<string, unknown>
    next: string[]
    auditLog?: unknown[]
  }
}

const statusBadgeVariant = (status: string) => {
  switch (status) {
    case 'completed':
      return 'success'
    case 'active':
    case 'running':
      return 'info'
    case 'waiting':
    case 'pending':
      return 'warning'
    case 'error':
    case 'failed':
      return 'error'
    default:
      return 'default'
  }
}

const AdminPipelinePage = () => {
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [source, setSource] = useState('')
  const [meetingDatetime, setMeetingDatetime] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [threadId, setThreadId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(new Set())
  const [threadStates, setThreadStates] = useState<Map<string, ThreadStatus['data']>>(new Map())
  const [actions, setActions] = useState<Record<string, string>>({})
  const [approvingThreads, setApprovingThreads] = useState<Set<string>>(new Set())

  const startPipeline = useManualFetch<PipelineResponse>('', {})
  const fetchStatus = useManualFetch<ThreadStatus>('', {})
  const approveThread = useManualFetch<unknown>('', {})

  const [threadsResponse, isLoadingThreads, , , refetchThreads] = useFetch<ThreadsResponse, null>(
    'pipeline/threads',
    { method: 'get' },
    null
  )

  const threads = threadsResponse?.data?.threads ?? []

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setThreadId(null)
    setError(null)

    const [data, err] = await startPipeline({
      url: 'pipeline/start',
      method: 'post',
      data: {
        clientName,
        clientEmail,
        clientPhone,
        source: source || undefined,
        meetingDatetime: meetingDatetime || undefined,
      },
    })

    if (err || !data) {
      setError(err?.message || 'Failed to start pipeline')
    } else {
      setThreadId(data.data.threadId)
      refetchThreads()
    }

    setIsSubmitting(false)
  }

  const toggleExpand = useCallback(
    async (tid: string) => {
      setExpandedThreads((prev) => {
        const next = new Set(prev)
        if (next.has(tid)) {
          next.delete(tid)
        } else {
          next.add(tid)
        }
        return next
      })

      if (!threadStates.has(tid)) {
        const [data] = await fetchStatus({
          url: `pipeline/status/${tid}`,
          method: 'get',
        })
        if (data?.data) {
          setThreadStates((prev) => new Map(prev).set(tid, data.data))
        }
      }
    },
    [threadStates, fetchStatus]
  )

  const handleApprove = useCallback(
    async (tid: string) => {
      const action = actions[tid]?.trim()
      if (!action) return

      setApprovingThreads((prev) => new Set(prev).add(tid))

      await approveThread({
        url: `pipeline/approve/${tid}`,
        method: 'post',
        data: { action },
      })

      setActions((prev) => ({ ...prev, [tid]: '' }))
      setThreadStates((prev) => {
        const next = new Map(prev)
        next.delete(tid)
        return next
      })
      setApprovingThreads((prev) => {
        const next = new Set(prev)
        next.delete(tid)
        return next
      })
      refetchThreads()
    },
    [actions, approveThread, refetchThreads]
  )

  return (
    <>
      <DocumentTitle title="Admin Pipeline" />
      <AppPageLayout
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Pipeline' }]}
        title="Pipeline Testing"
        subtitle="Trigger the LangGraph client pipeline manually"
      >
        <div className={styles.container}>
          <Card>
            <CardContent>
              <form className={styles.form} onSubmit={handleSubmit}>
                <InputField
                  label="Client Name"
                  value={clientName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setClientName(e.target.value)
                  }
                  required
                />
                <div className={styles.formRow}>
                  <InputField
                    label="Client Email"
                    type="email"
                    value={clientEmail}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setClientEmail(e.target.value)
                    }
                    required
                  />
                  <InputField
                    label="Client Phone"
                    type="tel"
                    value={clientPhone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setClientPhone(e.target.value)
                    }
                    required
                  />
                </div>
                <div className={styles.formRow}>
                  <Select
                    label="Source"
                    value={source}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setSource(e.target.value)
                    }
                    placeholder="Select a source"
                  >
                    <option value="Manual">Manual</option>
                    <option value="Referral">Referral</option>
                    <option value="Website">Website</option>
                    <option value="Notion Calendar">Notion Calendar</option>
                  </Select>
                  <InputField
                    label="Meeting Date/Time"
                    type="datetime-local"
                    value={meetingDatetime}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setMeetingDatetime(e.target.value)
                    }
                  />
                </div>
                <div className={styles.meetingLink}>
                  <Text variant="body-sm" emphasis>
                    Meeting Link
                  </Text>
                  <Text variant="body-sm">{MEETING_LINK}</Text>
                </div>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Starting Pipeline...' : 'Start Pipeline'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {threadId && (
            <div className={styles.result}>
              <Text variant="body-md" emphasis>
                Pipeline started successfully
              </Text>
              <Text variant="body-sm">Thread ID: {threadId}</Text>
            </div>
          )}

          {error && (
            <div className={styles.error}>
              <Text variant="body-md">{error}</Text>
            </div>
          )}

          <div className={styles.threadList}>
            <Text variant="headline-sm">Active Threads</Text>

            {isLoadingThreads && <Text variant="body-sm">Loading threads...</Text>}

            {!isLoadingThreads && threads.length === 0 && (
              <Text variant="body-sm">No active threads</Text>
            )}

            {threads.map((thread) => {
              const isExpanded = expandedThreads.has(thread.thread_id)
              const state = threadStates.get(thread.thread_id)
              const isApproving = approvingThreads.has(thread.thread_id)

              return (
                <Card key={thread.thread_id}>
                  <CardHeader>
                    <CardTitle>
                      <div className={styles.cardHeader}>
                        <div className={styles.cardHeaderLeft}>
                          <Text variant="body-md" emphasis>
                            {thread.client_email || thread.thread_id}
                          </Text>
                          <Badge variant={statusBadgeVariant(thread.status)}>{thread.status}</Badge>
                          <Text variant="body-sm" className={styles.cardMeta}>
                            {new Date(thread.created_at).toLocaleDateString()}
                          </Text>
                        </div>
                        <button
                          className={styles.expandButton}
                          onClick={() => toggleExpand(thread.thread_id)}
                        >
                          {isExpanded ? 'Collapse' : 'Expand'}
                        </button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isExpanded && state && (
                      <div className={styles.expandedContent}>
                        <dl className={styles.dataGrid}>
                          {state.state.clientName != null && (
                            <>
                              <dt>Client Name</dt>
                              <dd>{String(state.state.clientName)}</dd>
                            </>
                          )}
                          {state.state.status != null && (
                            <>
                              <dt>Status</dt>
                              <dd>{String(state.state.status)}</dd>
                            </>
                          )}
                          {state.state.lastActivity != null && (
                            <>
                              <dt>Last Activity</dt>
                              <dd>{String(state.state.lastActivity)}</dd>
                            </>
                          )}
                          <dt>Next Nodes</dt>
                          <dd>{state.next.length > 0 ? state.next.join(', ') : 'None'}</dd>
                        </dl>
                      </div>
                    )}
                    {isExpanded && !state && (
                      <div className={styles.expandedContent}>
                        <Text variant="body-sm">Loading state...</Text>
                      </div>
                    )}
                    <div className={styles.approveForm}>
                      <div className={styles.approveRow}>
                        <InputField
                          label="Action"
                          value={actions[thread.thread_id] || ''}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setActions((prev) => ({ ...prev, [thread.thread_id]: e.target.value }))
                          }
                          placeholder="e.g. approve, reject, skip"
                        />
                        <Button
                          disabled={isApproving || !actions[thread.thread_id]?.trim()}
                          onClick={() => handleApprove(thread.thread_id)}
                        >
                          {isApproving ? 'Approving...' : 'Approve'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </AppPageLayout>
    </>
  )
}

export default AdminPipelinePage
