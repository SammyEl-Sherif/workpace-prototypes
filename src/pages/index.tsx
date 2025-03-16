import React from 'react'

import { GetServerSideProps } from 'next'

import { DocumentTitle } from '@/layout/DocumentTitle'
import { WorkpaceProjects } from '@/layout/pages'
import { withPageRequestWrapper } from '@/server/utils/withPageRequestWrapper'

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async () => {
  return {}
})

const WorkPaceProjectsPage = () => {
  return (
    <>
      <DocumentTitle title="Home" />
      <WorkpaceProjects />
    </>
  )
}

export default WorkPaceProjectsPage
