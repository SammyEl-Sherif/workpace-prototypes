import { NextApiRequest, NextApiResponse } from 'next'

import { getNextAuth } from '@/apis/routes'

// https://next-auth.js.org/providers/auth0
export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await getNextAuth(req, res)
    return result
  } catch (error) {
    throw error
  }
}
