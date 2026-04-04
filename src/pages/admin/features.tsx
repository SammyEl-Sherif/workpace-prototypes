import { GetServerSideProps } from 'next'

import { AppPageLayout } from '@/layout'
import { DocumentTitle } from '@/layout/DocumentTitle'
import { FeatureFlags } from '@/modules/FeatureFlags'
import { withPageRequestWrapper } from '@/server/utils/withPageRequestWrapper'

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async () => {
  return {}
})

const FeatureFlagsPage = () => {
  return (
    <>
      <DocumentTitle title="Feature Flags" />
      <AppPageLayout
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Feature Flags' }]}
        title="Feature Flags"
        subtitle="Manage boolean feature flags to control feature visibility across the application. Toggle flags on and off without deploying."
      >
        <FeatureFlags />
      </AppPageLayout>
    </>
  )
}

export default FeatureFlagsPage
