import { GetServerSideProps } from 'next'

import { Card, CardContent, CardHeader, CardTitle, Text } from '@workpace/design-system'

import { DocumentTitle } from '@/layout/DocumentTitle'
import { PortalPageLayout } from '@/layout/PortalPageLayout'
import { withPageRequestWrapper } from '@/server/utils'

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async () => {
  return {}
})

const PortalContractsPage = () => {
  return (
    <>
      <DocumentTitle title="Portal - Contracts" />
      <PortalPageLayout title="Contracts" subtitle="View and sign your project contracts">
        <Card>
          <CardHeader>
            <CardTitle>Contracts</CardTitle>
          </CardHeader>
          <CardContent>
            <Text variant="body-md">
              Your contracts will appear here. You&apos;ll be able to review and sign documents
              electronically.
            </Text>
          </CardContent>
        </Card>
      </PortalPageLayout>
    </>
  )
}

export default PortalContractsPage
