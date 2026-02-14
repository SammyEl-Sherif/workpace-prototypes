import { GetServerSideProps } from 'next'

import { Card, CardContent, CardHeader, CardTitle, Text } from '@workpace/design-system'

import { DocumentTitle } from '@/layout/DocumentTitle'
import { PortalPageLayout } from '@/layout/PortalPageLayout'
import { withPageRequestWrapper } from '@/server/utils'

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async () => {
  return {}
})

const PortalIntakePage = () => {
  return (
    <>
      <DocumentTitle title="Portal - Intake" />
      <PortalPageLayout title="Intake" subtitle="Submit your project intake information">
        <Card>
          <CardHeader>
            <CardTitle>Intake Form</CardTitle>
          </CardHeader>
          <CardContent>
            <Text variant="body-md">
              The intake form will be available here. You&apos;ll be able to provide project
              details, requirements, and preferences.
            </Text>
          </CardContent>
        </Card>
      </PortalPageLayout>
    </>
  )
}

export default PortalIntakePage
