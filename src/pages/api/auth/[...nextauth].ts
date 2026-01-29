import { NextApiRequest, NextApiResponse } from 'next'

import { getNextAuth } from '@/api/routes'

// https://next-auth.js.org/providers/auth0
export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  // Log environment variables on server-side (these should be available in API routes)
  console.log('[api/auth/[...nextauth]] Environment Variables Check:')
  console.log('  NEXTAUTH_URL:', process.env.NEXTAUTH_URL || 'NOT SET')
  console.log('  NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET')
  console.log('  AUTH0_CLIENT_ID:', process.env.AUTH0_CLIENT_ID ? 'SET' : 'NOT SET')
  console.log('  AUTH0_CLIENT_SECRET:', process.env.AUTH0_CLIENT_SECRET ? 'SET' : 'NOT SET')
  console.log('  AUTH0_ISSUER_BASE_URL:', process.env.AUTH0_ISSUER_BASE_URL || 'NOT SET')
  console.log('  AUTH0_SCOPE:', process.env.AUTH0_SCOPE || 'NOT SET')
  console.log('  AUTH0_AUDIENCE:', process.env.AUTH0_AUDIENCE || 'NOT SET')
  console.log('  NODE_ENV:', process.env.NODE_ENV)

  console.log('[api/auth/[...nextauth]] Request received:', {
    method: req.method,
    url: req.url,
    path: req.url?.split('?')[0],
    query: req.query,
  })

  try {
    const result = await getNextAuth(req, res)
    console.log('[api/auth/[...nextauth]] Request handled successfully')
    return result
  } catch (error) {
    console.error('[api/auth/[...nextauth]] Error:', error)
    throw error
  }
}
