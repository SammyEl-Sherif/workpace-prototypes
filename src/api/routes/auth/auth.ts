import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth from 'next-auth/next'

import { getAuthOptions } from '@/server/utils'

export const getNextAuth = (req: NextApiRequest, res: NextApiResponse) => {
  const authOptions = getAuthOptions()
  return NextAuth(req, res, authOptions)
}
