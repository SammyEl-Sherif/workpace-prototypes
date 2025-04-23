import OpenAI from 'openai'

import { PageSummary } from '@/interfaces/notion'
import { HttpResponse } from '@/server/types'

type YearEndReviewResponse = {
  response: string | null
}

export const getYearEndReviewController = async ({
  client,
  accomplishments,
  userPrompt,
}: {
  client: OpenAI
  accomplishments: PageSummary[]
  userPrompt: string | null
}): Promise<HttpResponse<YearEndReviewResponse>> => {
  try {
    const response: OpenAI.Chat.Completions.ChatCompletion = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Utilize the following relevant data (${JSON.stringify(
            accomplishments
          )}) for headings and return the response as a string which utilizes markdown syntax. 
          Write a report in essay style without bullet points unless I say to use bullet points. Do not use triple backticks for formatting; 
          I will format it using the npm package react-markdown.`,
        },
        {
          role: 'user',
          content:
            userPrompt ?? 'Write me a year end self reflection report I can submit to my manager.',
        },
      ],
    })

    return {
      data: { response: response.choices[0].message.content },
      status: 200,
    }
  } catch (error) {
    return {
      data: { response: 'ChatGPT could not generate your repsonse, please try again soon ...' },
      status: 500,
    }
  }
}
