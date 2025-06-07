import React from 'react'

import { GetServerSideProps } from 'next'

import { getNotionDatabasesController } from '@/api/controllers'
import { NotionDatabase } from '@/interfaces/notion'
import { DocumentTitle } from '@/layout/DocumentTitle'
import GoodStuffList from '@/layout/pages/GoodStuffListPage/GoodStuffListPage'
import { NotionDatabaseContextProvider } from '@/modules/AccomplishmentReport/contexts'
import { withNotionClient } from '@/server/utils/withNotionClient'
import { withPageRequestWrapper } from '@/server/utils/withPageRequestWrapper'
import HeroLayout from '@/layout/HeroLayout'
import MainLayout from '@/layout/MainLayout'

export interface GoodStuffListPageProps {
  databases: NotionDatabase[]
  defaultFilter: {
    property: string
    status: {
      equals: string
    }
  }
}

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async (context) => {
  const { databases, defaultFilter } = await withNotionClient(async (_, __, client) => {
    const { data } = await getNotionDatabasesController(client)
    return {
      databases: data.databases,
      defaultFilter: data.defaultFilter,
    }
  })(context.req, context.res)
  return {
    databases,
    defaultFilter,
  }
})

const HomePage = ({ databases, defaultFilter }: GoodStuffListPageProps) => {
  return (
    <>
      <HeroLayout
        title="🥇 The Good Stuff List"
        subHeadingTitle="Turn task data into valuable artifacts"
        subheadingDescription="When it comes to writting a year end review, updating your resume, or advocating for that promotion, its essential to let no accomplishment slip through the cracks."
      />
      <MainLayout>
        <NotionDatabaseContextProvider
          database_id={databases[0] ? databases[0].id : ''}
          databases={databases}
          filters={defaultFilter}
        >
          <DocumentTitle title="Home" />
          <GoodStuffList />
        </NotionDatabaseContextProvider>
      </MainLayout>
    </>
  )
}

export default HomePage
