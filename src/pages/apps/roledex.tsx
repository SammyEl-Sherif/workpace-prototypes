import { GetServerSideProps } from 'next'

import { DocumentTitle } from '@/layout/DocumentTitle'
import { Roledex } from '@/modules/Roledex'
import { withPageRequestWrapper } from '@/server/utils/withPageRequestWrapper'

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async () => {
  return {}
})

const RoledexPage = () => {
  return (
    <>
      <DocumentTitle title="Roledex" />
      <Roledex />
    </>
  )
}

export default RoledexPage
