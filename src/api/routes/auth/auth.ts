import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth from 'next-auth/next'

import { getAuthOptions } from '@/server/utils'

export const getNextAuth = (req: NextApiRequest, res: NextApiResponse) => {
  const authOptions = getAuthOptions()

  // Use NEXTAUTH_URL if set (recommended for Vercel custom domains)
  // Otherwise, use x-forwarded-host from Vercel or fall back to host header
  if (process.env.NEXTAUTH_URL) {
    const url = new URL(process.env.NEXTAUTH_URL)
    Object.assign(req.headers, {
      'x-forwarded-host': url.host, // Host should NOT include path
      'x-forwarded-proto': url.protocol.replace(':', ''),
    })
  } else {
    // Fallback: use headers from Vercel (x-forwarded-host is set for custom domains)
    const forwardedHost = req.headers['x-forwarded-host'] as string
    const forwardedProto = req.headers['x-forwarded-proto'] as string

    if (forwardedHost) {
      Object.assign(req.headers, {
        'x-forwarded-host': forwardedHost,
        'x-forwarded-proto':
          forwardedProto || (process.env.NODE_ENV === 'production' ? 'https' : 'http'),
      })
    }
  }

  return NextAuth(req, res, authOptions)
}
