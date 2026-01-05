import { GetServerSideProps } from 'next'

import { DocumentTitle } from '@/layout/DocumentTitle'
import { WorkpacePrototypes } from '@/layout/pages'
import { withPageRequestWrapper } from '@/server/utils/withPageRequestWrapper'

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async () => {
  return {}
})

const WorkPacePrototypesPage = () => {
  return (
    <>
      <DocumentTitle title="Prototypes" />
      <WorkpacePrototypes />
    </>
  )
}

export default WorkPacePrototypesPage
