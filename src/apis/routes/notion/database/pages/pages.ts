import { NextApiRequest, NextApiResponse } from 'next'

import { getNotionPagesController } from '@/apis/controllers'
import { requireApiAuth, withNotionClient } from '@/server/utils'

export const getNotionDatabasePagesRoute = requireApiAuth(
  withNotionClient<NextApiRequest, NextApiResponse>(async (request, response, notionClient) => {
    const { database_id, filters, query, filter_by_creator } = request.body

    // Get user ID from session for fetching stored Notion user ID
    const { getSupabaseSession } = await import('@/server/utils/supabase/getSupabaseSession')
    const session = await getSupabaseSession(request)
    const userId = session?.user?.id

    // Determine filterByCreator value: undefined = auto-enable if user ID stored, false = disable, true = enable
    // IMPORTANT: Only treat as false if explicitly set to false. If not in body, it's undefined.
    const filterByCreatorValue =
      'filter_by_creator' in request.body && request.body.filter_by_creator === false
        ? false
        : 'filter_by_creator' in request.body && request.body.filter_by_creator === true
        ? true
        : undefined // Auto-enable if user ID is stored

    try {
      try {
        const { data, status } = await getNotionPagesController(
          notionClient,
          database_id,
          filters,
          query,
          filterByCreatorValue,
          userId // Pass user ID to fetch stored Notion user ID
        )
        response.status(status).json(data)
      } catch (err: any) {
        response.status(err.statusCode || 500).json(err.message)
      }
    } catch (error) {
      response.status(500).json({ message: 'Internal server error' })
    }
  })
)
