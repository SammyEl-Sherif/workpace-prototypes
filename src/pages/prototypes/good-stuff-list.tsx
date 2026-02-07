import { GetServerSideProps } from 'next'

import { DocumentTitle } from '@/layout'
import { withPageRequestWrapper } from '@/server/utils'
import { GoodThingsListPage } from '@/modules/GoodThingsList'

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async () => {
  return {}
})

const HomePage = () => {
  return (
    <>
      <DocumentTitle title="Good Stuff List" />
      <GoodThingsListPage />
    </>
  )
}

export default HomePage
