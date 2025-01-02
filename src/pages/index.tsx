import React from 'react'

import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints'
import { GetServerSideProps } from 'next'
import OpenAI from 'openai'

import {
  getNotionAccomplishmentsController,
  getNotionDatabaseInfoController,
  getNotionDatabasesController,
} from '@/api/controllers'
import { getYearEndReviewController } from '@/api/controllers/openai/yearEndReview/yearEndReview'
import { NotionDatabase } from '@/interfaces/notion'
import { DocumentTitle } from '@/layout/DocumentTitle'
import MainLayout from '@/layout/MainLayout'
import NotionInsights from '@/layout/pages/NotionInsightsPage/NotionInsightsPage'
import { withNotionClient } from '@/server/utils/withNotionClient'
import { withOpenaiClient } from '@/server/utils/withOpenaiClient'
import { withPageRequestWrapper } from '@/server/utils/withPageRequestWrapper'

export interface HomePageProps {
  props: {
    accomplishments: QueryDatabaseResponse[]
    title: string
    response: OpenAI.Chat.Completions.ChatCompletionMessage['content']
    mocked: boolean
    databases: NotionDatabase[]
  }
}

const HomePage = (props: HomePageProps) => {
  return (
    <MainLayout>
      <DocumentTitle title="Home" />
      <NotionInsights {...props} />
    </MainLayout>
  )
}

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async (context) => {
  const { accomplishments, title, databases } = await withNotionClient(async (_, __, client) => {
    const accomplishments = await getNotionAccomplishmentsController(client)
    const dbInfo = await getNotionDatabaseInfoController(client)
    const databases = await getNotionDatabasesController(client)
    return {
      accomplishments,
      title: dbInfo.data?.title[0].plain_text,
      databases: databases.data,
    }
  })(context.req, context.res)

  const { response, mocked } = await withOpenaiClient(async (_, __, client) => {
    const response = await getYearEndReviewController(client, accomplishments, true)
    return { response: response.data.response, mocked: response.data.mocked }
  })(context.req, context.res)

  return {
    props: {
      accomplishments: accomplishments.data,
      title,
      response: response ? response : 'Cannot generate a response from ChatGPT at the moment ...',
      mocked,
      databases,
    },
  }
})

export default HomePage
