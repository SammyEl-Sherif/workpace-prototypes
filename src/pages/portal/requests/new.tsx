import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'

import { Button, Card, CardContent, CardHeader, CardTitle } from '@workpace/design-system'

import { useManualFetch } from '@/hooks/useManualFetch'
import { ChangeRequest, ChangeRequestCategory, ChangeRequestPriority } from '@/interfaces/portal'
import { Routes } from '@/interfaces/routes'
import { DocumentTitle } from '@/layout/DocumentTitle'
import { PortalPageLayout } from '@/layout/PortalPageLayout'
import { withPageRequestWrapper } from '@/server/utils'

import styles from './requests.module.scss'

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async () => {
  return {}
})

const NewRequestPage = () => {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<ChangeRequestCategory>('other')
  const [priority, setPriority] = useState<ChangeRequestPriority>('medium')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const createRequest = useManualFetch<{ data: { request: ChangeRequest } }>('', {})

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!title.trim() || !description.trim()) return

      setIsSubmitting(true)
      const [data] = await createRequest({
        url: 'portal/requests',
        method: 'post',
        data: { title, description, category, priority },
      })
      if (data) {
        router.push(Routes.PORTAL_REQUESTS)
      }
      setIsSubmitting(false)
    },
    [title, description, category, priority, createRequest, router]
  )

  return (
    <>
      <DocumentTitle title="Portal - New Request" />
      <PortalPageLayout title="New Request" subtitle="Submit a change request">
        <Card>
          <CardHeader>
            <CardTitle>Request Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Title *</label>
                <input
                  className={styles.input}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Brief summary of your request"
                  required
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Description *</label>
                <textarea
                  className={styles.textarea}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what you need in detail..."
                  required
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Category</label>
                <select
                  className={styles.select}
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ChangeRequestCategory)}
                >
                  <option value="bug_fix">Bug Fix</option>
                  <option value="feature_request">Feature Request</option>
                  <option value="improvement">Improvement</option>
                  <option value="documentation">Documentation</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Priority</label>
                <select
                  className={styles.select}
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as ChangeRequestPriority)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div className={styles.formActions}>
                <Button
                  variant="default-secondary"
                  onClick={() => router.push(Routes.PORTAL_REQUESTS)}
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !title.trim() || !description.trim()}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </PortalPageLayout>
    </>
  )
}

export default NewRequestPage
