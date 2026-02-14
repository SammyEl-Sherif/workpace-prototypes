import { GetServerSideProps } from 'next'

import { Card, CardContent, CardHeader, CardTitle, Text } from '@workpace/design-system'

import { usePortalContext } from '@/contexts/PortalContextProvider'
import { DocumentTitle } from '@/layout/DocumentTitle'
import { PortalPageLayout } from '@/layout/PortalPageLayout'
import { withPageRequestWrapper } from '@/server/utils'

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async () => {
  return {}
})

const PortalSettingsPage = () => {
  const { portalUser } = usePortalContext()

  return (
    <>
      <DocumentTitle title="Portal - Settings" />
      <PortalPageLayout title="Settings" subtitle="Manage your organization settings">
        <Card>
          <CardHeader>
            <CardTitle>Organization Info</CardTitle>
          </CardHeader>
          <CardContent>
            {portalUser ? (
              <>
                <Text variant="body-md">
                  <strong>Organization:</strong> {portalUser.org_name}
                </Text>
                <Text variant="body-md">
                  <strong>Role:</strong> {portalUser.role}
                </Text>
                <Text variant="body-md">
                  <strong>Status:</strong> {portalUser.status}
                </Text>
              </>
            ) : (
              <Text variant="body-md">Loading organization info...</Text>
            )}
          </CardContent>
        </Card>
      </PortalPageLayout>
    </>
  )
}

export default PortalSettingsPage
