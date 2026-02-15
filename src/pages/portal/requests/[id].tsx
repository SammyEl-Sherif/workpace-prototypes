import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'

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
    hour: 'numeric',
    minute: '2-digit',
  })
}

const RequestDetailPage = () => {
  const router = useRouter()
  const { id } = router.query

  const [response, isLoading] = useFetch<{ data: { request: ChangeRequest | null } }, null>(
    id ? `portal/requests/${id}` : null,
    { method: 'get' },
    null
  )

  const request = response?.data?.request ?? null

  if (isLoading) {
    return (
      <>
        <DocumentTitle title="Portal - Request" />
        <PortalPageLayout title="Request Details">
          <Card>
            <CardContent>
              <Text variant="body-md">Loading...</Text>
            </CardContent>
          </Card>
        </PortalPageLayout>
      </>
    )
  }

  if (!request) {
    return (
      <>
        <DocumentTitle title="Portal - Request Not Found" />
        <PortalPageLayout title="Request Not Found">
          <Card>
            <CardContent>
              <Text variant="body-md">This request could not be found.</Text>
              <Link href={Routes.PORTAL_REQUESTS}>
                <Button variant="default-secondary" style={{ marginTop: '16px' }}>
                  Back to Requests
                </Button>
              </Link>
            </CardContent>
          </Card>
        </PortalPageLayout>
      </>
    )
  }

  return (
    <>
      <DocumentTitle title={`Portal - ${request.title}`} />
      <PortalPageLayout title="Request Details">
        <Link href={Routes.PORTAL_REQUESTS}>
          <Button variant="default-secondary" style={{ marginBottom: '16px' }}>
            Back to Requests
          </Button>
        </Link>

        <Card>
          <CardContent>
            <div className={styles.detailHeader}>
              <h2 className={styles.detailTitle}>{request.title}</h2>
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

            <div className={styles.detailMeta}>
              <div>
                <div className={styles.detailLabel}>Category</div>
                <div className={styles.detailValue}>{request.category.replace('_', ' ')}</div>
              </div>
              <div>
                <div className={styles.detailLabel}>Submitted</div>
                <div className={styles.detailValue}>{formatDate(request.created_at)}</div>
              </div>
              <div>
                <div className={styles.detailLabel}>Last Updated</div>
                <div className={styles.detailValue}>{formatDate(request.updated_at)}</div>
              </div>
            </div>

            <div className={styles.detailSection}>
              <div className={styles.detailLabel}>Description</div>
              <div className={styles.detailValue}>{request.description}</div>
            </div>

            {request.admin_notes && (
              <div className={styles.adminNotes}>
                <div className={styles.detailLabel}>Admin Notes</div>
                <div className={styles.detailValue}>{request.admin_notes}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </PortalPageLayout>
    </>
  )
}

export default RequestDetailPage
