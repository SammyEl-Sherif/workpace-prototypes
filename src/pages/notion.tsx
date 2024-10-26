import React from 'react'
import { useState, useEffect, useRef, useCallback } from 'react'

import { Client } from '@notionhq/client'
import {
  QueryDatabaseResponse,
  DatabaseObjectResponse,
  PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints'
import OpenAI from 'openai'

import { DocumentTitle } from '@/layout/DocumentTitle'
import MainLayout from '@/layout/MainLayout'
import NotionInsights from '@/layout/pages/NotionInsightsPage/NotionInsightsPage'

interface MyComponentProps {
  results: QueryDatabaseResponse[]
  title: DatabaseObjectResponse['title']
  response: OpenAI.Chat.Completions.ChatCompletionMessage['content']
}

const MyComponent = (props: MyComponentProps) => {
  return (
    <MainLayout>
      <DocumentTitle title="Landing Page" />
      <NotionInsights {...props} />
    </MainLayout>
  )
}

export async function getServerSideProps() {
  const databaseId = process.env.NOTION_DB_ID || ''
  const notion = new Client({ auth: process.env.NOTION_API_KEY })
  const pages: QueryDatabaseResponse = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: 'Status',
      status: {
        equals: '🏆 Accomplishment',
      },
    },
  })
  const database = await notion.databases.retrieve({ database_id: databaseId })

  const pageSummaries: any = []
  for (const page of pages.results as (PageObjectResponse & {
    properties: {
      'AI summary': {
        rich_text: {
          plain_text: string | null
        }[]
      }
      Name: {
        title: {
          plain_text: string | null
        }[]
      }
      'Due Date': {
        date: {
          start: string | null
          end: string | null
          time_zone: string | null
        }
      }
      Type: {
        select: {
          name: string | null
        }
      }
    }
  })[]) {
    pageSummaries.push({
      title: page.properties.Name.title[0].plain_text,
      summary: page.properties['AI summary'].rich_text[0].plain_text,
      date: page.properties['Due Date'].date.start,
      type: page.properties.Type.select.name,
    })
  }

  const openai = new OpenAI({
    organization: process.env.OPENAI_ORG_ID || '',
    project: process.env.OPENAI_PROJECT_ID,
    apiKey: process.env.OPENAI_API_KEY,
  })

  const userPrompt = `Take the following array of objects, which are a list of accomplishments of mine over the last 6 months, and write me a mid year self reflection review I can submit to my boss for my mid year review: ${JSON.stringify(
    pageSummaries
  )}`

  const response: OpenAI.Chat.Completions.ChatCompletion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content:
          "Act as if you're me, a junior developer, and use relevant data in each index for things such as headings and return the response in markdown. Make it in a more essay format, no bullet points.",
      },
      {
        role: 'user',
        content: userPrompt,
      },
    ],
  })
  console.log('here', pageSummaries)
  return {
    props: { ...pages, ...database, response: response.choices[0].message.content },
  }
}

export default MyComponent
