import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth from 'next-auth/next'

import { getAuthOptions } from '@/server/utils'

export const getNextAuth = (req: NextApiRequest, res: NextApiResponse) => {
  const authOptions = getAuthOptions()
  Object.assign(req.headers, {
    'x-forwarded-host': `${process.env.HOST}/api/auth`,
    'x-forwarded-proto': process.env.NODE_ENV === 'production' ? 'https' : 'http',
  })
  return NextAuth(req, res, authOptions)
}