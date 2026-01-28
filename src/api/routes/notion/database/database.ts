import { NextApiRequest, NextApiResponse } from 'next'

import { getNotionDatabaseInfoController, getNotionPagesController } from '@/api/controllers'
import { withNotionClient } from '@/server/utils'

export const getNotionDatabaseRoute = withNotionClient<NextApiRequest, NextApiResponse>(
  async (request, response, notionClient) => {
    const { action, database_id, filters } = request.body

    try {
      if (action === 'info') {
        const { data, status } = await getNotionDatabaseInfoController(notionClient, database_id)
        response.status(status).json(data)
      } else if (action === 'pages') {
        const { data, status } = await getNotionPagesController(notionClient, database_id, filters)
        response.status(status).json(data)
      } else {
        response.status(400).json({ error: 'Invalid action. Must be "info" or "pages"' })
      }
    } catch (error: any) {
      response.status(error.statusCode || 500).json(error.message)
    }
  }
)

