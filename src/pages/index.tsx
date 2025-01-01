import React from 'react'

import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints'
import { GetServerSideProps } from 'next'
import OpenAI from 'openai'

import {
  getNotionAccomplishmentsController,
  getNotionDatabaseInfoController,
} from '@/api/controllers'
import { getYearEndReviewController } from '@/api/controllers/openai/yearEndReview/yearEndReview'
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
  }
}

const HomePage = (props: HomePageProps) => {
  return (
    <MainLayout>
      <DocumentTitle title="Landing Page" />
      <NotionInsights {...props} />
    </MainLayout>
  )
}

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async (context) => {
  const { accomplishments, title } = await withNotionClient(async (_, __, client) => {
    const accomplishments = await getNotionAccomplishmentsController(client)
    const dbInfo = await getNotionDatabaseInfoController(client)
    return {
      accomplishments,
      title: dbInfo.data?.title[0].plain_text,
    }
  })(context.req, context.res)

  const { response } = await withOpenaiClient(async (_, __, client) => {
    const response = await getYearEndReviewController(client, accomplishments)
    return { response: response.data }
  })(context.req, context.res)

  return {
    props: {
      accomplishments: accomplishments.data,
      title,
      response: response ? response : 'Cannot generate a response from ChatGPT at the moment ...',
    },
  }
})

export default HomePage
