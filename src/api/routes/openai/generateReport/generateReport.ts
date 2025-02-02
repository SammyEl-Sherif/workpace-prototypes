import { NextApiRequest, NextApiResponse } from 'next'

import { getYearEndReviewController } from '@/api/controllers'
import { PageSummary } from '@/interfaces/notion'
import { GenerateReportDTO } from '@/interfaces/openai'
import { withOpenaiClient } from '@/server/utils/withOpenaiClient'

export const generateReportRoute = withOpenaiClient<
  NextApiRequest,
  NextApiResponse<GenerateReportDTO>
>(async (request, response, notionClient) => {
  const { accomplishments, userPrompt }: { accomplishments: PageSummary[]; userPrompt: string } =
    request.body
  try {
    try {
      const { data, status } = await getYearEndReviewController(
        notionClient,
        accomplishments,
        userPrompt
      )
      response.status(status).json(data)
    } catch (err: any) {
      response.status(err.statusCode || 500).json(err.message)
    }
    response.status(200)
  } catch (error) {
    response.status(500)
  }
})
