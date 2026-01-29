import { NextApiRequest, NextApiResponse } from 'next'

import { getNextAuth } from '@/api/routes'

// https://next-auth.js.org/providers/auth0
export default async function auth(req: NextApiRequest, res: NextApiResponse) {
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
