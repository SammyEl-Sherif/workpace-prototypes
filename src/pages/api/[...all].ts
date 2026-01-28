import { NextApiRequest, NextApiResponse } from 'next'

import { getNextAuth } from '@/api/routes'
import { revokeSession } from '@/api/routes/auth'
import { getNotionDatabaseRoute } from '@/api/routes/notion'
import { generateReportRoute } from '@/api/routes/openai'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

// Unified API handler that routes all API requests
// This creates a single serverless function instead of multiple
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const path = Array.isArray(req.query.all) ? req.query.all.join('/') : ''

  // Auth routes - handle NextAuth and revoke-session
  if (path.startsWith('auth/')) {
    const authPath = path.replace('auth/', '')

    // Handle revoke-session
    if (authPath === 'revoke-session') {
      return await revokeSession(req, res)
    }

    // Handle all other NextAuth routes (signin, signout, callback, csrf, session, providers, etc.)
    // NextAuth expects the path segments in query.nextauth array
    const nextAuthSegments = authPath.split('/').filter(Boolean)
    // Modify req.query to include nextauth for NextAuth
    req.query.nextauth = nextAuthSegments as any
    return await getNextAuth(req, res)
  }

  // Notion routes
  if (path === 'notion/database') {
    return await apiRequestWrapper({
      [HttpMethod.POST]: getNotionDatabaseRoute,
    })(req, res)
  }

  // OpenAI routes
  if (path === 'openai/generateReport') {
    return await apiRequestWrapper({
      [HttpMethod.POST]: generateReportRoute,
    })(req, res)
  }

  // 404 for unknown routes
  res.status(404).json({ error: 'Not found' })
}
