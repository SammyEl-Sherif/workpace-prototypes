import { GetServerSideProps } from 'next'

import { DocumentTitle } from '@/layout/DocumentTitle'
import { PageHeader } from '@/layout/PageHeader'
import { WorkpaceApps } from '@/layout/pages'
import { withPageRequestWrapper } from '@/server/utils/withPageRequestWrapper'

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async () => {
  return {}
})

const WorkPaceAppsPage = () => {
  return (
    <>
      <DocumentTitle title="Apps" />
      <PageHeader
        title="Apps"
        subtitle="Products designed to bring a change of pace to your online workspace. Explore what we're building."
      />
      <WorkpaceApps />
    </>
  )
}

export default WorkPaceAppsPage
