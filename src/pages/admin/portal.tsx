import { GetServerSideProps } from 'next'
import { useState } from 'react'

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Text,
} from '@workpace/design-system'

import { useFetch, useManualFetch } from '@/hooks'
import { PortalUserWithOrgAndIntake } from '@/interfaces/portal'
import { DocumentTitle } from '@/layout/DocumentTitle'
import { PageHeader } from '@/layout/PageHeader'
import { withPageRequestWrapper } from '@/server/utils'

import styles from './admin.module.scss'

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async () => {
  return {}
})

const IntakeDetails = ({ user }: { user: PortalUserWithOrgAndIntake }) => {
  const [expanded, setExpanded] = useState(false)

  if (!user.intake_id) {
    return (
      <Text variant="body-sm" style={{ color: 'var(--color-neutral-400)', marginTop: 8 }}>
        No intake submission
      </Text>
    )
  }

  return (
    <div style={{ marginTop: 12 }}>
      <Button variant="default-secondary" onClick={() => setExpanded(!expanded)}>
        {expanded ? 'Hide' : 'Show'} Intake Details
      </Button>
      {expanded && (
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {user.company_info && (
            <div style={{ padding: 12, background: 'var(--color-neutral-50)', borderRadius: 8 }}>
              <Text variant="body-sm" style={{ fontWeight: 600, marginBottom: 8 }}>
                Company Info
              </Text>
              {user.company_info.company_name && (
                <Text variant="body-sm">Company: {user.company_info.company_name}</Text>
              )}
              {user.company_info.industry && (
                <Text variant="body-sm">Industry: {user.company_info.industry}</Text>
              )}
              {user.company_info.company_size && (
                <Text variant="body-sm">Size: {user.company_info.company_size}</Text>
              )}
              {user.company_info.website && (
                <Text variant="body-sm">Website: {user.company_info.website}</Text>
              )}
              {user.company_info.primary_contact_name && (
                <Text variant="body-sm">
                  Contact: {user.company_info.primary_contact_name}
                  {user.company_info.primary_contact_email &&
                    ` (${user.company_info.primary_contact_email})`}
                </Text>
              )}
              {user.company_info.primary_contact_phone && (
                <Text variant="body-sm">Phone: {user.company_info.primary_contact_phone}</Text>
              )}
            </div>
          )}
          {user.tools_tech && (
            <div style={{ padding: 12, background: 'var(--color-neutral-50)', borderRadius: 8 }}>
              <Text variant="body-sm" style={{ fontWeight: 600, marginBottom: 8 }}>
                Tools & Tech
              </Text>
              {user.tools_tech.current_tools && user.tools_tech.current_tools.length > 0 && (
                <Text variant="body-sm">
                  Current Tools: {user.tools_tech.current_tools.join(', ')}
                </Text>
              )}
              {user.tools_tech.preferred_platforms &&
                user.tools_tech.preferred_platforms.length > 0 && (
                  <Text variant="body-sm">
                    Preferred Platforms: {user.tools_tech.preferred_platforms.join(', ')}
                  </Text>
                )}
              {user.tools_tech.integrations_needed &&
                user.tools_tech.integrations_needed.length > 0 && (
                  <Text variant="body-sm">
                    Integrations: {user.tools_tech.integrations_needed.join(', ')}
                  </Text>
                )}
              {user.tools_tech.tech_notes && (
                <Text variant="body-sm">Notes: {user.tools_tech.tech_notes}</Text>
              )}
            </div>
          )}
          {user.goals_needs && (
            <div style={{ padding: 12, background: 'var(--color-neutral-50)', borderRadius: 8 }}>
              <Text variant="body-sm" style={{ fontWeight: 600, marginBottom: 8 }}>
                Goals & Needs
              </Text>
              {user.goals_needs.primary_goals && user.goals_needs.primary_goals.length > 0 && (
                <Text variant="body-sm">Goals: {user.goals_needs.primary_goals.join(', ')}</Text>
              )}
              {user.goals_needs.pain_points && user.goals_needs.pain_points.length > 0 && (
                <Text variant="body-sm">
                  Pain Points: {user.goals_needs.pain_points.join(', ')}
                </Text>
              )}
              {user.goals_needs.timeline && (
                <Text variant="body-sm">Timeline: {user.goals_needs.timeline}</Text>
              )}
              {user.goals_needs.budget_range && (
                <Text variant="body-sm">Budget: {user.goals_needs.budget_range}</Text>
              )}
              {user.goals_needs.additional_notes && (
                <Text variant="body-sm">Notes: {user.goals_needs.additional_notes}</Text>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const AdminPortalPage = () => {
  const [response, isLoading, , , refetch] = useFetch<
    { data: { pendingUsers: PortalUserWithOrgAndIntake[] } },
    null
  >('portal/admin/pending', { method: 'get' }, null)

  const approver = useManualFetch<{ data: { portalUser: any } }>('')
  const deactivator = useManualFetch<{ data: { portalUser: any } }>('')

  const pendingUsers = response?.data?.pendingUsers ?? []

  const handleApprove = async (id: string) => {
    await approver({
      url: `portal/admin/${id}/approve`,
      method: 'patch',
    })
    refetch()
  }

  const handleDeactivate = async (id: string) => {
    await deactivator({
      url: `portal/admin/${id}/deactivate`,
      method: 'patch',
    })
    refetch()
  }

  return (
    <>
      <DocumentTitle title="Admin - Portal Users" />
      <PageHeader
        title="Portal Users"
        subtitle="Manage portal user access requests and approvals"
      />
      <div className={styles.container}>
        {isLoading && <Text variant="body-md">Loading...</Text>}
        {!isLoading && pendingUsers.length === 0 && (
          <Text variant="body-md">No pending portal users.</Text>
        )}
        {pendingUsers.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <CardTitle>{user.org_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Text variant="body-sm">User ID: {user.user_id}</Text>
              <Text variant="body-sm">
                Signed up: {new Date(user.created_at).toLocaleDateString()}
              </Text>
              <Badge variant="warning">{user.status}</Badge>
              <IntakeDetails user={user} />
              <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                <Button variant="brand-primary" onClick={() => handleApprove(user.id)}>
                  Approve
                </Button>
                <Button variant="default-secondary" onClick={() => handleDeactivate(user.id)}>
                  Deactivate
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}

export default AdminPortalPage
