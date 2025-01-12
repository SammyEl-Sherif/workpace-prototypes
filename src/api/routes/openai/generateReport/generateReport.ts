import { NextApiRequest, NextApiResponse } from 'next'

import { getYearEndReviewController } from '@/api/controllers'
import { withOpenaiClient } from '@/server/utils/withOpenaiClient'

export const generateReportRoute = withOpenaiClient<NextApiRequest, NextApiResponse>(
  async (request, response, notionClient) => {
    const { pages, userPrompt } = request.body

    try {
      try {
        const data = await getYearEndReviewController(notionClient, pages, true, userPrompt)
        response.status(200).json(data)
      } catch (err: any) {
        response.status(err.statusCode || 500).json(err.message)
      }
      response.status(200)
    } catch (error) {
      response.status(500)
    }
  }
)
