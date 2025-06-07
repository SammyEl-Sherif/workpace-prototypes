import React from 'react'

import { GetServerSideProps } from 'next'

import { DocumentTitle } from '@/layout/DocumentTitle'
import { WorkpacePrototypes } from '@/layout/pages'
import { withPageRequestWrapper } from '@/server/utils/withPageRequestWrapper'
import MainLayout from '@/layout/MainLayout'

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async () => {
  return {}
})

const WorkPacePrototypesPage = () => {
  return (
    <MainLayout>
      <DocumentTitle title="Home" />
      <WorkpacePrototypes />
    </MainLayout>
  )
}

export default WorkPacePrototypesPage
