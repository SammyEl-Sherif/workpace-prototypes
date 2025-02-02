import React from 'react'

import { GetServerSideProps } from 'next'

import { getNotionDatabasesController } from '@/api/controllers'
import { NotionDatabase, PageSummary } from '@/interfaces/notion'
import { DocumentTitle } from '@/layout/DocumentTitle'
import MainLayout from '@/layout/MainLayout'
import NotionInsights from '@/layout/pages/NotionInsightsPage/NotionInsightsPage'
import { NotionDatabaseContextProvider } from '@/modules/AccomplishmentReport/contexts'
import { withNotionClient } from '@/server/utils/withNotionClient'
import { withPageRequestWrapper } from '@/server/utils/withPageRequestWrapper'

export interface GoodStuffListPageProps {
  databases: NotionDatabase[]
}

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async (context) => {
  const { databases } = await withNotionClient(async (_, __, client) => {
    const { data } = await getNotionDatabasesController(client)
    return {
      databases: data,
    }
  })(context.req, context.res)

  return {
    databases,
  }
})

const HomePage = ({ databases }: GoodStuffListPageProps) => {
  return (
    <NotionDatabaseContextProvider database_id={databases[0].id} filters={null}>
      <MainLayout>
        <DocumentTitle title="Home" />
        <NotionInsights databases={databases} />
      </MainLayout>
    </NotionDatabaseContextProvider>
  )
}

export default HomePage
