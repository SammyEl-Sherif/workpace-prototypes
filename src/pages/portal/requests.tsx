import { GetServerSideProps } from 'next'

import { Card, CardContent, CardHeader, CardTitle, Text } from '@workpace/design-system'

import { DocumentTitle } from '@/layout/DocumentTitle'
import { PortalPageLayout } from '@/layout/PortalPageLayout'
import { withPageRequestWrapper } from '@/server/utils'

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async () => {
  return {}
})

const PortalRequestsPage = () => {
  return (
    <>
      <DocumentTitle title="Portal - Requests" />
      <PortalPageLayout title="Requests" subtitle="Submit and track change requests">
        <Card>
          <CardHeader>
            <CardTitle>Change Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Text variant="body-md">
              Submit and manage change requests here. Track the status of each request through
              review and implementation.
            </Text>
          </CardContent>
        </Card>
      </PortalPageLayout>
    </>
  )
}

export default PortalRequestsPage
