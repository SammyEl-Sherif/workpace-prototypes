import { GetServerSideProps } from 'next'

import { DocumentTitle } from '@/layout/DocumentTitle'
import { PageHeader } from '@/layout/PageHeader'
import { FeatureFlags } from '@/modules/FeatureFlags'
import { withPageRequestWrapper } from '@/server/utils/withPageRequestWrapper'

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async () => {
  return {}
})

const FeatureFlagsPage = () => {
  return (
    <>
      <DocumentTitle title="Feature Flags" />
      <PageHeader
        title="Feature Flags"
        subtitle="Manage boolean feature flags to control feature visibility across the application. Toggle flags on and off without deploying."
      />
      <FeatureFlags />
    </>
  )
}

export default FeatureFlagsPage
