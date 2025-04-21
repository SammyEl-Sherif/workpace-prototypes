import { NextApiRequest, NextApiResponse } from 'next'

import { getYearEndReviewController } from '@/api/controllers'
import { PageSummary } from '@/interfaces/notion'
import { GenerateReportDTO } from '@/interfaces/openai'
import { withOpenaiClient } from '@/server/utils/withOpenaiClient'

export const generateReportRoute = withOpenaiClient<
  NextApiRequest,
  NextApiResponse<GenerateReportDTO>
>(async (request, response, notionClient) => {
  const { pages, userPrompt }: { pages: PageSummary[]; userPrompt: string } = request.body
  try {
    const { data, status } = await getYearEndReviewController({
      client: notionClient,
      accomplishments: pages,
      userPrompt,
    })
    response.status(status).json(data)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    response.status(err.statusCode || 500).json(err.message)
  }
})
