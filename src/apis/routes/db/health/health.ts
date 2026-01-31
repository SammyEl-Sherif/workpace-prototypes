import { NextApiRequest, NextApiResponse } from 'next'

import { getDbInfo, supabasePool, testConnection } from '@/db'

interface DatabaseStatus {
  status: 'healthy' | 'unhealthy'
  info?: {
    type: string
    host?: string
    database?: string
    user?: string
  }
  error?: string
  code?: string
}

/**
 * GET /api/db
 * Public route - no authentication required
 *
 * Query params:
 * - type: string (optional) - 'supabase' to test specific connection
 */
export const getDbHealthRoute = async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  const { type } = request.query

  try {
    if (type === 'supabase' || !type) {
      const dbInfo = getDbInfo(supabasePool)
      await testConnection(supabasePool)

      const result: DatabaseStatus = {
        status: 'healthy',
        info: dbInfo,
      }

      response.status(200).json({
        status: 'healthy',
        database: 'supabase',
        ...result,
      })
      return
    }

    response.status(400).json({ error: 'Unknown database type. Use ?type=supabase' })
  } catch (error) {
    const dbError = error as { message: string; code?: string }
    response.status(503).json({
      status: 'unhealthy',
      database: type || 'supabase',
      error: dbError.message,
      code: dbError.code,
    })
  }
}
