import React from 'react'

import { GetServerSideProps } from 'next'

import { DocumentTitle } from '@/layout/DocumentTitle'
import { WorkpacePrototypes } from '@/layout/pages'
import { withPageRequestWrapper } from '@/server/utils/withPageRequestWrapper'
import { withApiClient } from '@/server/utils'
import { getWorkPacePrototypesController } from '@/api/controllers'

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async (context) => {
  const { prototypes } = await withApiClient(async (_, __, client) => {
    const prototypes = await getWorkPacePrototypesController(client)
    return { prototypes }
  })(context.req, context.res)

  return {
    prototypes,
  }
})

const WorkPacePrototypesPage = () => {
  return (
    <>
      <DocumentTitle title="Home" />
      <WorkpacePrototypes />
    </>
  )
}

export default WorkPacePrototypesPage
