import React from 'react'

import { GetServerSideProps } from 'next'

import { Prototype } from '@/interfaces/prototypes'
import { DocumentTitle } from '@/layout/DocumentTitle'
import MainLayout from '@/layout/MainLayout'
import { AboutPage } from '@/layout/pages/AboutPage'
import { PrototypesContextProvider } from '@/modules'
import { getPrototypesMetadata } from '@/server/utils'
import { withPageRequestWrapper } from '@/server/utils/withPageRequestWrapper'

type WorkPaceProjectsPageProps = {
  prototypes: Prototype[]
}

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async (context) => {
  const prototypes = getPrototypesMetadata()
  return {
    prototypes,
  }
})

const WorkPaceProjectsPage = ({ prototypes }: WorkPaceProjectsPageProps) => {
  return (
    <PrototypesContextProvider prototypes={prototypes}>
      <MainLayout>
        <DocumentTitle title="About" />
        <AboutPage />
      </MainLayout>
    </PrototypesContextProvider>
  )
}

export default WorkPaceProjectsPage
