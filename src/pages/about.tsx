import React from 'react'

import { GetServerSideProps } from 'next'

import { DocumentTitle } from '@/layout/DocumentTitle'
import { AboutPage } from '@/layout/pages/AboutPage'
import { withPageRequestWrapper } from '@/server/utils'

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async () => {
  return {}
})

const WorkPaceProjectsPage = () => {
  return (
    <>
      <DocumentTitle title="About" />
      <AboutPage />
    </>
  )
}

export default WorkPaceProjectsPage
