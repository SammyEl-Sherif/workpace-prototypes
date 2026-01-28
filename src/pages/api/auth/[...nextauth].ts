import { NextApiRequest, NextApiResponse } from 'next'

import { getNextAuth } from '@/api/routes'
import { revokeSession } from '@/api/routes/auth'

// Unified auth handler that handles both NextAuth routes and revoke-session
export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  // Check if this is a revoke-session request
  // NextAuth catch-all routes are available at /api/auth/[...nextauth]
  // So /api/auth/revoke-session would be caught here with nextauth = ['revoke-session']
  const path = Array.isArray(req.query.nextauth) ? req.query.nextauth[0] : ''
  
  if (path === 'revoke-session') {
    return await revokeSession(req, res)
  }
  
  // Otherwise, handle as NextAuth route
  return await getNextAuth(req, res)
}
