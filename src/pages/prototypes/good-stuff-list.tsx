import React from 'react'

import { GetServerSideProps } from 'next'

import { getNotionDatabasesController } from '@/api/controllers'
import { NotionDatabase } from '@/interfaces/notion'
import { NotionInsights, DocumentTitle } from '@/layout'
import { NotionDatabaseContextProvider } from '@/modules/AccomplishmentReport/contexts'
import { withPageRequestWrapper, withNotionClient } from '@/server/utils'

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
    const {
      data: { databases, defaultFilter },
    } = await getNotionDatabasesController(client)

    return {
      databases: databases,
      defaultFilter: defaultFilter,
    }
  })(context.req, context.res)

  // TODO: If a user does not have any databases them, direct them to a resources to duplicate

  return {
    databases,
    defaultFilter,
  }
})

const HomePage = ({ databases, defaultFilter }: GoodStuffListPageProps) => {
  return (
    <NotionDatabaseContextProvider
      database_id={databases[0] ? databases[0].id : ''}
      databases={databases}
      filters={defaultFilter}
    >
      <DocumentTitle title="Home" />
      <NotionInsights />
    </NotionDatabaseContextProvider>
  )
}

export default HomePage
