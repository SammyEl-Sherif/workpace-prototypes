import { FC, useEffect, useState } from 'react'

import { Button, Text } from '@workpace/design-system'
import { useRouter } from 'next/router'

import { usePortalContext } from '@/contexts/PortalContextProvider'
import { useManualFetch } from '@/hooks/useManualFetch'
import {
  CompanyInfoData,
  GoalsNeedsData,
  IntakeSubmission,
  ToolsTechData,
} from '@/interfaces/portal'
import { Routes } from '@/interfaces/routes'

import styles from './PortalGuard.module.scss'

interface PortalGuardProps {
  children: React.ReactNode
}

const SubmissionSummary: FC<{
  companyInfo?: CompanyInfoData | null
  toolsTech?: ToolsTechData | null
  goalsNeeds?: GoalsNeedsData | null
}> = ({ companyInfo, toolsTech, goalsNeeds }) => (
  <div className={styles.summarySection}>
    {companyInfo && (
      <div className={styles.summaryGroup}>
        <h3 className={styles.summaryGroupTitle}>Company Info</h3>
        {companyInfo.company_name && (
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Company Name</span>
            <span className={styles.summaryValue}>{companyInfo.company_name}</span>
          </div>
        )}
        {companyInfo.industry && (
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Industry</span>
            <span className={styles.summaryValue}>{companyInfo.industry}</span>
          </div>
        )}
        {companyInfo.company_size && (
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Company Size</span>
            <span className={styles.summaryValue}>{companyInfo.company_size}</span>
          </div>
        )}
        {companyInfo.website && (
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Website</span>
            <span className={styles.summaryValue}>{companyInfo.website}</span>
          </div>
        )}
        {companyInfo.primary_contact_name && (
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Primary Contact</span>
            <span className={styles.summaryValue}>
              {companyInfo.primary_contact_name}
              {companyInfo.primary_contact_email && ` (${companyInfo.primary_contact_email})`}
            </span>
          </div>
        )}
      </div>
    )}
    {toolsTech && (
      <div className={styles.summaryGroup}>
        <h3 className={styles.summaryGroupTitle}>Tools & Tech</h3>
        {toolsTech.current_tools && toolsTech.current_tools.length > 0 && (
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Current Tools</span>
            <span className={styles.summaryValue}>{toolsTech.current_tools.join(', ')}</span>
          </div>
        )}
        {toolsTech.preferred_platforms && toolsTech.preferred_platforms.length > 0 && (
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Preferred Platforms</span>
            <span className={styles.summaryValue}>{toolsTech.preferred_platforms.join(', ')}</span>
          </div>
        )}
        {toolsTech.integrations_needed && toolsTech.integrations_needed.length > 0 && (
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Integrations Needed</span>
            <span className={styles.summaryValue}>{toolsTech.integrations_needed.join(', ')}</span>
          </div>
        )}
        {toolsTech.tech_notes && (
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Notes</span>
            <span className={styles.summaryValue}>{toolsTech.tech_notes}</span>
          </div>
        )}
      </div>
    )}
    {goalsNeeds && (
      <div className={styles.summaryGroup}>
        <h3 className={styles.summaryGroupTitle}>Goals & Needs</h3>
        {goalsNeeds.primary_goals && goalsNeeds.primary_goals.length > 0 && (
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Primary Goals</span>
            <span className={styles.summaryValue}>{goalsNeeds.primary_goals.join(', ')}</span>
          </div>
        )}
        {goalsNeeds.pain_points && goalsNeeds.pain_points.length > 0 && (
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Pain Points</span>
            <span className={styles.summaryValue}>{goalsNeeds.pain_points.join(', ')}</span>
          </div>
        )}
        {goalsNeeds.timeline && (
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Timeline</span>
            <span className={styles.summaryValue}>{goalsNeeds.timeline}</span>
          </div>
        )}
        {goalsNeeds.budget_range && (
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Budget Range</span>
            <span className={styles.summaryValue}>{goalsNeeds.budget_range}</span>
          </div>
        )}
        {goalsNeeds.additional_notes && (
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Additional Notes</span>
            <span className={styles.summaryValue}>{goalsNeeds.additional_notes}</span>
          </div>
        )}
      </div>
    )}
  </div>
)

export const PortalGuard: FC<PortalGuardProps> = ({ children }) => {
  const router = useRouter()
  const { isLoading, isPortalMember, isApproved, isPending, portalUser } = usePortalContext()
  const [submission, setSubmission] = useState<IntakeSubmission | null>(null)
  const [submissionLoaded, setSubmissionLoaded] = useState(false)

  const fetcher = useManualFetch<{ data: { submission: IntakeSubmission | null } }>('')

  useEffect(() => {
    if (isPending && !submissionLoaded) {
      fetcher({ url: 'portal/pending-submission', method: 'get' }).then(([data]) => {
        if (data?.data?.submission) {
          setSubmission(data.data.submission)
        }
        setSubmissionLoaded(true)
      })
    }
  }, [isPending, submissionLoaded]) // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return null
  }

  if (!isPortalMember) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <div className={styles.icon}>&#128203;</div>
          <Text variant="headline-md" className={styles.title}>
            Welcome to the Client Portal
          </Text>
          <Text variant="body-md" className={styles.message}>
            Sign up to get started with your organization&apos;s portal access.
          </Text>
          <Button variant="brand-primary" onClick={() => router.push(Routes.PORTAL_SIGNUP)}>
            Sign Up
          </Button>
        </div>
      </div>
    )
  }

  if (isPending) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.contentWide}>
          <div className={styles.icon}>&#9203;</div>
          <Text variant="headline-md" className={styles.title}>
            Your Request Is Being Reviewed
          </Text>
          <Text variant="body-md" className={styles.message}>
            Your portal access request is pending approval. You&apos;ll be notified once an
            administrator reviews your request.
          </Text>
          {submission && (
            <SubmissionSummary
              companyInfo={submission.company_info}
              toolsTech={submission.tools_tech}
              goalsNeeds={submission.goals_needs}
            />
          )}
        </div>
      </div>
    )
  }

  if (portalUser?.status === 'deactivated') {
    return (
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <div className={styles.icon}>&#128683;</div>
          <Text variant="headline-md" className={styles.title}>
            Access Deactivated
          </Text>
          <Text variant="body-md" className={styles.message}>
            Your portal access has been deactivated. Please contact your administrator for
            assistance.
          </Text>
        </div>
      </div>
    )
  }

  if (isApproved) {
    return <>{children}</>
  }

  return null
}
