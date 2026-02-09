import { GetServerSideProps } from 'next'

import { DocumentTitle } from '@/layout/DocumentTitle'
import { PageHeader } from '@/layout/PageHeader'
import { WorkpacePrototypes } from '@/layout/pages'
import { withPageRequestWrapper } from '@/server/utils/withPageRequestWrapper'

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async () => {
  return {}
})

const WorkPacePrototypesPage = () => {
  return (
    <>
      <DocumentTitle title="Prototypes" />
      <PageHeader
        title="Prototypes"
        subtitle="Products designed to bring a change of pace to your online workspace. Explore what we're building."
      />
      <WorkpacePrototypes />
    </>
  )
}

export default WorkPacePrototypesPage
