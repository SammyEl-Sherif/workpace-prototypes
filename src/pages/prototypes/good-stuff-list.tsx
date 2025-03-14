import React from 'react'

import { GetServerSideProps } from 'next'

import { getNotionDatabasesController } from '@/api/controllers'
import { NotionDatabase } from '@/interfaces/notion'
import { Prototype } from '@/interfaces/prototypes'
import { DocumentTitle } from '@/layout/DocumentTitle'
import MainLayout from '@/layout/MainLayout'
import NotionInsights from '@/layout/pages/NotionInsightsPage/NotionInsightsPage'
import { PrototypesContextProvider } from '@/modules'
import { NotionDatabaseContextProvider } from '@/modules/AccomplishmentReport/contexts'
import { getPrototypesMetadata } from '@/server/utils'
import { withNotionClient } from '@/server/utils/withNotionClient'
import { withPageRequestWrapper } from '@/server/utils/withPageRequestWrapper'

export interface GoodStuffListPageProps {
  databases: NotionDatabase[]
  prototypes: Prototype[]
}

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async (context) => {
  const prototypes = getPrototypesMetadata()

  const { databases } = await withNotionClient(async (_, __, client) => {
    const { data } = await getNotionDatabasesController(client)
    return {
      databases: data,
    }
  })(context.req, context.res)

  return {
    databases,
    prototypes,
  }
})

const HomePage = ({ databases, prototypes }: GoodStuffListPageProps) => {
  return (
    <PrototypesContextProvider prototypes={prototypes}>
      <NotionDatabaseContextProvider database_id={databases[0].id} filters={null}>
        <MainLayout>
          <DocumentTitle title="Home" />
          <NotionInsights databases={databases} />
        </MainLayout>
      </NotionDatabaseContextProvider>
    </PrototypesContextProvider>
  )
}

export default HomePage
