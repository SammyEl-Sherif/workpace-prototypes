import { GetServerSideProps } from 'next'
import Link from 'next/link'

import { Button, Card, CardContent, Text } from '@workpace/design-system'

import { useFetch } from '@/hooks'
import { ChangeRequest } from '@/interfaces/portal'
import { Routes } from '@/interfaces/routes'
import { DocumentTitle } from '@/layout/DocumentTitle'
import { PortalPageLayout } from '@/layout/PortalPageLayout'
import { withPageRequestWrapper } from '@/server/utils'

import styles from './requests.module.scss'

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async () => {
  return {}
})

const STATUS_LABELS: Record<string, string> = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  approved: 'Approved',
  in_progress: 'In Progress',
  completed: 'Completed',
  rejected: 'Rejected',
}

const STATUS_CLASS: Record<string, string> = {
  submitted: styles.submitted,
  under_review: styles.underReview,
  approved: styles.approved,
  in_progress: styles.inProgress,
  completed: styles.completed,
  rejected: styles.rejected,
}

const PRIORITY_CLASS: Record<string, string> = {
  low: styles.low,
  medium: styles.medium,
  high: styles.high,
  urgent: styles.urgent,
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const PortalRequestsPage = () => {
  const [response, isLoading] = useFetch<{ data: { requests: ChangeRequest[] } }, null>(
    'portal/requests',
    { method: 'get' },
    null
  )

  const requests = response?.data?.requests ?? []

  return (
    <>
      <DocumentTitle title="Portal - Requests" />
      <PortalPageLayout title="Requests" subtitle="Submit and track change requests">
        <div className={styles.headerRow}>
          <Text variant="body-md">
            {isLoading
              ? 'Loading...'
              : `${requests.length} request${requests.length !== 1 ? 's' : ''}`}
          </Text>
          <Link href={`${Routes.PORTAL_REQUESTS}/new`}>
            <Button>New Request</Button>
          </Link>
        </div>

        {!isLoading && requests.length === 0 && (
          <Card>
            <CardContent>
              <div className={styles.emptyState}>
                <Text variant="headline-sm">No requests yet</Text>
                <Text variant="body-md">Submit your first change request to get started.</Text>
              </div>
            </CardContent>
          </Card>
        )}

        <div className={styles.requestList}>
          {requests.map((request) => (
            <Link
              key={request.id}
              href={`${Routes.PORTAL_REQUESTS}/${request.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div className={styles.requestItem}>
                <div className={styles.requestInfo}>
                  <h3 className={styles.requestTitle}>{request.title}</h3>
                  <div className={styles.requestMeta}>
                    <span>{formatDate(request.created_at)}</span>
                    <span>{request.category.replace('_', ' ')}</span>
                  </div>
                </div>
                <div className={styles.badges}>
                  <span
                    className={`${styles.badge} ${styles.badgeStatus} ${
                      STATUS_CLASS[request.status] || ''
                    }`}
                  >
                    {STATUS_LABELS[request.status] || request.status}
                  </span>
                  <span
                    className={`${styles.badge} ${styles.badgePriority} ${
                      PRIORITY_CLASS[request.priority] || ''
                    }`}
                  >
                    {request.priority}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </PortalPageLayout>
    </>
  )
}

export default PortalRequestsPage
