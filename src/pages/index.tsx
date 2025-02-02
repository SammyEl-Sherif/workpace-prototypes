import React from 'react'

import { GetServerSideProps } from 'next'

import { getProjectsController } from '@/api/controllers/pocketbase'
import { DocumentTitle } from '@/layout/DocumentTitle'
import MainLayout from '@/layout/MainLayout'
import { WorkpaceProjects } from '@/layout/pages'
import { PocketbaseProjectsContextProvider } from '@/modules'
import { ProjectsRecord } from '@/pocketbase-types'
import { withPageRequestWrapper } from '@/server/utils/withPageRequestWrapper'
import { withPocketbaseClient } from '@/server/utils/withPocketbaseClient'

type WorkPaceProjectsPageProps = {
  projects: ProjectsRecord[] | null
}

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async (context) => {
  const { projects } = await withPocketbaseClient(async (_, __, client) => {
    const { data } = await getProjectsController(client) // keep, a users list of databases, need auth
    return {
      projects: data,
    }
  })(context.req, context.res)

  return {
    projects,
  }
})

const WorkPaceProjectsPage = ({ projects }: WorkPaceProjectsPageProps) => {
  return (
    <PocketbaseProjectsContextProvider projects={projects}>
      <MainLayout>
        <DocumentTitle title="Home" />
        <WorkpaceProjects />
      </MainLayout>
    </PocketbaseProjectsContextProvider>
  )
}

export default WorkPaceProjectsPage
