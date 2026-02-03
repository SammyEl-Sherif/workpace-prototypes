/**
 * @deprecated This file contains the old Notion-based implementation
 * Kept for reference and potential future migration back
 *
 * Original implementation date: Before migration to Supabase
 * Migration date: Current
 */

import { GetServerSideProps } from 'next'

import { getNotionDatabasesController } from '@/apis/controllers'
import { NotionDatabase } from '@/interfaces/notion'
import { DocumentTitle, NotionInsights } from '@/layout'
import { NotionDatabaseContextProvider } from '@/modules/AccomplishmentReport/contexts'
import { withNotionClient, withPageRequestWrapper } from '@/server/utils'

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
