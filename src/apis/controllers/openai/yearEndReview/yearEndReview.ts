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
    // Format accomplishments in a more readable way for the AI
    const formattedAccomplishments = accomplishments
      .map((acc, index) => {
        const parts = [
          `Accomplishment ${index + 1}:`,
          `Title: ${acc.title || 'Untitled'}`,
          acc.summary ? `Description: ${acc.summary}` : null,
          acc.completionDate ? `Completion Date: ${acc.completionDate}` : null,
          acc.accomplishmentType ? `Category/Goal: ${acc.accomplishmentType}` : null,
        ]
          .filter(Boolean)
          .join('\n')
        return parts
      })
      .join('\n\n')

    const systemPrompt = `You are a professional report writer. Your task is to create a report based EXCLUSIVELY on the following accomplishments provided by the user.

CRITICAL INSTRUCTIONS:
- You MUST base your report ONLY on the accomplishments listed below
- Do NOT invent, fabricate, or add accomplishments that are not in the provided list
- Use the exact titles, descriptions, dates, and categories from the provided data
- If an accomplishment has a description, use it in your report
- Group accomplishments by their category/goal (accomplishmentType) when applicable
- Include completion dates when available
- Write in essay style without bullet points (unless the user specifically requests bullet points)
- Use markdown syntax for formatting (headings, emphasis, etc.)
- Do NOT use triple backticks for code blocks
- The response will be formatted using react-markdown

Here are the user's accomplishments:

${formattedAccomplishments}

Remember: Only write about these specific accomplishments. Do not add anything that is not explicitly listed above.`

    const response: OpenAI.Chat.Completions.ChatCompletion = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
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
