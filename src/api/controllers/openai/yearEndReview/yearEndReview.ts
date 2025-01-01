import OpenAI from 'openai'

import { HttpResponse } from '@/server/types'

export const getYearEndReviewController = async (
  client: OpenAI,
  pages: any
): Promise<HttpResponse<string | null>> => {
  try {
    const userPrompt = `Take the following array of objects, which are a list of accomplishments of mine over the last 6 months, and write me a mid year self reflection review I can submit to my boss for my mid year review: ${JSON.stringify(
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
          content: userPrompt,
        },
      ],
    })

    return {
      data: response.choices[0].message.content,
      status: 200,
    }
  } catch (error) {
    return {
      data: null,
      status: 500,
    }
  }
}
