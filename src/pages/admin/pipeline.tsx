import { FormEvent, useState } from 'react'
import { GetServerSideProps } from 'next'

import { Button, Card, CardContent, InputField, Select, Text } from '@workpace/design-system'

import { DocumentTitle } from '@/layout/DocumentTitle'
import { PageHeader } from '@/layout/PageHeader'
import { useManualFetch } from '@/hooks'
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

const AdminPipelinePage = () => {
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [source, setSource] = useState('')
  const [meetingDatetime, setMeetingDatetime] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [threadId, setThreadId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const startPipeline = useManualFetch<PipelineResponse>('', {})

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
    }

    setIsSubmitting(false)
  }

  return (
    <>
      <DocumentTitle title="Admin Pipeline" />
      <PageHeader
        title="Pipeline Testing"
        subtitle="Trigger the LangGraph client pipeline manually"
      />
      <div className={styles.container}>
        <Card>
          <CardContent>
            <form className={styles.form} onSubmit={handleSubmit}>
              <InputField
                label="Client Name"
                value={clientName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setClientName(e.target.value)}
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
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSource(e.target.value)}
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
            <Text variant="body-sm">
              Use POST /api/pipeline/approve with this threadId to advance the pipeline.
            </Text>
          </div>
        )}

        {error && (
          <div className={styles.error}>
            <Text variant="body-md">{error}</Text>
          </div>
        )}
      </div>
    </>
  )
}

export default AdminPipelinePage
