import OpenAI from 'openai'

import { HttpResponse } from '@/server/types'

import markdownMock from '!raw-loader!./mockedResponse.md'

type YearEndReviewResponse = {
  response: string | null
  mocked: boolean
}

export const getYearEndReviewController = async (
  client: OpenAI,
  pages: any,
  mock: boolean,
  userPrompt: string | null
): Promise<HttpResponse<YearEndReviewResponse>> => {
  if (mock) {
    return {
      data: { response: markdownMock, mocked: mock },
      status: 200,
    }
  }
  try {
    const yearEndReviewPrompt = `Take the following array of objects, which are a list of accomplishments of mine over the last 6 months, and write me a mid year self reflection review I can submit to my boss for my mid year review: ${JSON.stringify(
      pages
    )}`

    const response: OpenAI.Chat.Completions.ChatCompletion = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            "Act as if you're me, a junior developer, and use relevant data in each index for things such as headings and return the response in markdown. Make it in a more essay format, no bullet points.",
        },
        {
          role: 'user',
          content: userPrompt ?? yearEndReviewPrompt,
        },
      ],
    })

    return {
      data: { response: response.choices[0].message.content, mocked: mock },
      status: 200,
    }
  } catch (error) {
    return {
      data: { response: null, mocked: mock },
      status: 500,
    }
  }
}
