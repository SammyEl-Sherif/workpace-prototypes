import { NextApiRequest, NextApiResponse } from 'next'

import { getNextAuth } from '@/api/routes'

// https://next-auth.js.org/providers/auth0
export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await getNextAuth(req, res)
}
