import { GetServerSideProps } from 'next'
import Link from 'next/link'

import { Card, CardContent, CardHeader, CardTitle, Text } from '@workpace/design-system'

import { usePortalContext } from '@/contexts/PortalContextProvider'
import { useFetch } from '@/hooks'
import { ChangeRequest, Contract, IntakeSubmission } from '@/interfaces/portal'
import { Routes } from '@/interfaces/routes'
import { DocumentTitle } from '@/layout/DocumentTitle'
import { PortalPageLayout } from '@/layout/PortalPageLayout'
import { withPageRequestWrapper } from '@/server/utils'

import styles from './index.module.scss'

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async () => {
  return {}
})

const STATUS_BADGE_CLASS: Record<string, string> = {
  submitted: styles.badgeSubmitted,
  under_review: styles.badgeUnderReview,
  approved: styles.badgeApproved,
  in_progress: styles.badgeInProgress,
  completed: styles.badgeCompleted,
  rejected: styles.badgeRejected,
}

const STATUS_LABELS: Record<string, string> = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  approved: 'Approved',
  in_progress: 'In Progress',
  completed: 'Completed',
  rejected: 'Rejected',
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

const PortalHomePage = () => {
  const { portalUser, isApproved } = usePortalContext()

  const [intakeResponse] = useFetch<{ data: { submission: IntakeSubmission | null } }, null>(
    'portal/intake',
    { method: 'get' },
    null
  )

  const [requestsResponse] = useFetch<{ data: { requests: ChangeRequest[] } }, null>(
    'portal/requests',
    { method: 'get' },
    null
  )

  const [contractsResponse] = useFetch<{ data: { contracts: Contract[] } }, null>(
    'portal/contracts',
    { method: 'get' },
    null
  )

  const intake = intakeResponse?.data?.submission ?? null
  const requests = requestsResponse?.data?.requests ?? []
  const contracts = contractsResponse?.data?.contracts ?? []
  const recentRequests = requests.slice(0, 3)

  // Onboarding checklist state
  const accountCreated = !!portalUser
  const accountApproved = isApproved
  const intakeSubmitted = intake?.status === 'submitted' || intake?.status === 'reviewed'
  const contractSigned = contracts.some((c) => c.status === 'signed')

  const checklistItems = [
    { label: 'Account created', done: accountCreated },
    { label: 'Account approved', done: accountApproved },
    { label: 'Intake form submitted', done: intakeSubmitted },
    { label: 'Contract signed', done: contractSigned },
  ]

  const completedCount = checklistItems.filter((item) => item.done).length
  const progressPercent = (completedCount / checklistItems.length) * 100

  // Determine next action
  let nextStepMessage = 'Welcome to your client portal!'
  if (!accountApproved) {
    nextStepMessage = "Your account is pending approval. We'll notify you once it's approved."
  } else if (!intakeSubmitted) {
    nextStepMessage = 'Complete your intake form to help us understand your project needs.'
  } else if (!contractSigned) {
    nextStepMessage = "Your intake has been submitted. We'll prepare a contract for you to review."
  } else {
    nextStepMessage = "You're all set! Use the portal to submit change requests and track progress."
  }

  return (
    <>
      <DocumentTitle title="Portal - Home" />
      <PortalPageLayout title="Welcome" subtitle="Your client portal dashboard">
        {/* Next Steps Card */}
        <div className={styles.nextStepsCard}>
          <h3 className={styles.nextStepsTitle}>Next Steps</h3>
          <p className={styles.nextStepsText}>{nextStepMessage}</p>
        </div>

        <div className={styles.grid}>
          {/* Onboarding Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Onboarding Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.progressSection}>
                <div className={styles.progressLabel}>
                  {completedCount} of {checklistItems.length} completed
                </div>
                <div className={styles.progressBarContainer}>
                  <div
                    className={styles.progressBarFill}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <div className={styles.checklist}>
                {checklistItems.map((item) => (
                  <div key={item.label} className={styles.checklistItem}>
                    <div
                      className={`${styles.checkIcon} ${
                        item.done ? styles.checkIconDone : styles.checkIconPending
                      }`}
                    >
                      {item.done && '\u2713'}
                    </div>
                    <span
                      className={`${styles.checklistLabel} ${
                        item.done ? styles.checklistLabelDone : ''
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {recentRequests.length === 0 ? (
                <div className={styles.emptyActivity}>
                  <Text variant="body-md">No recent activity</Text>
                </div>
              ) : (
                <div className={styles.activityList}>
                  {recentRequests.map((request) => (
                    <Link
                      key={request.id}
                      href={`${Routes.PORTAL_REQUESTS}/${request.id}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <div className={styles.activityItem}>
                        <span className={styles.activityTitle}>{request.title}</span>
                        <span
                          className={`${styles.badge} ${STATUS_BADGE_CLASS[request.status] || ''}`}
                        >
                          {STATUS_LABELS[request.status] || request.status}
                        </span>
                        <span className={styles.activityDate}>
                          {formatDate(request.created_at)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </PortalPageLayout>
    </>
  )
}

export default PortalHomePage
