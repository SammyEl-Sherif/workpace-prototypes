import { GetServerSideProps } from 'next'

import { Card, CardContent, CardHeader, CardTitle, Text } from '@workpace/design-system'

import { DocumentTitle } from '@/layout/DocumentTitle'
import { PortalPageLayout } from '@/layout/PortalPageLayout'
import { withPageRequestWrapper } from '@/server/utils'

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async () => {
  return {}
})

const PortalStatusPage = () => {
  return (
    <>
      <DocumentTitle title="Portal - Status" />
      <PortalPageLayout title="Status" subtitle="Track your project progress">
        <Card>
          <CardHeader>
            <CardTitle>Project Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Text variant="body-md">
              Your project status dashboard will appear here. Track milestones, deliverables, and
              overall progress.
            </Text>
          </CardContent>
        </Card>
      </PortalPageLayout>
    </>
  )
}

export default PortalStatusPage
