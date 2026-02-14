import { GetServerSideProps } from 'next'

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
import { PortalUserWithOrg } from '@/interfaces/portal'
import { DocumentTitle } from '@/layout/DocumentTitle'
import { PageHeader } from '@/layout/PageHeader'
import { withPageRequestWrapper } from '@/server/utils'

import styles from './admin.module.scss'

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async () => {
  return {}
})

const AdminPortalPage = () => {
  const [response, isLoading, , , refetch] = useFetch<
    { data: { pendingUsers: PortalUserWithOrg[] } },
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
