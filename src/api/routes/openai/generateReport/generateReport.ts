import { NextApiRequest, NextApiResponse } from 'next'

import { getYearEndReviewController } from '@/api/controllers'
import { GenerateReportDTO } from '@/interfaces/openai'
import { withOpenaiClient } from '@/server/utils/withOpenaiClient'

export const generateReportRoute = withOpenaiClient<
  NextApiRequest,
  NextApiResponse<GenerateReportDTO>
>(async (request, response, notionClient) => {
  const { pages, userPrompt } = request.body
  try {
    try {
      const data = await getYearEndReviewController(notionClient, pages, false, userPrompt)
      response.status(200).json(data)
    } catch (err: any) {
      response.status(err.statusCode || 500).json(err.message)
    }
    response.status(200)
  } catch (error) {
    response.status(500)
  }
})
