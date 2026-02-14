import { GetServerSideProps } from 'next'

import { Card, CardContent, CardHeader, CardTitle, Text } from '@workpace/design-system'

import { DocumentTitle } from '@/layout/DocumentTitle'
import { PortalPageLayout } from '@/layout/PortalPageLayout'
import { withPageRequestWrapper } from '@/server/utils'

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async () => {
  return {}
})

const PortalHomePage = () => {
  return (
    <>
      <DocumentTitle title="Portal - Home" />
      <PortalPageLayout title="Welcome" subtitle="Your client portal dashboard">
        <Card>
          <CardHeader>
            <CardTitle>Onboarding Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <Text variant="body-md">
              Your onboarding checklist will appear here. Complete each step to get started with
              your project.
            </Text>
          </CardContent>
        </Card>
      </PortalPageLayout>
    </>
  )
}

export default PortalHomePage
