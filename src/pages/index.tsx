import { GetServerSideProps } from 'next'

import { DocumentTitle } from '@/layout/DocumentTitle'
import { LandingPage } from '@/layout/pages'
import { withPageRequestWrapper } from '@/server/utils/withPageRequestWrapper'

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async () => {
  return {}
})

const HomePage = () => {
  return (
    <>
      <DocumentTitle title="WorkPace - A change of pace in your online workspace" />
      <LandingPage />
    </>
  )
}

export default HomePage
