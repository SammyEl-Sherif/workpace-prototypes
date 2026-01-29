import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth from 'next-auth/next'

import { getAuthOptions } from '@/server/utils'

export const getNextAuth = (req: NextApiRequest, res: NextApiResponse) => {
  const authOptions = getAuthOptions()

  // Determine host and protocol
  let finalHost: string | undefined
  let finalProtocol: string | undefined

  // Use NEXTAUTH_URL if set (recommended for Vercel custom domains)
  // Otherwise, use x-forwarded-host from Vercel or fall back to host header
  if (process.env.NEXTAUTH_URL) {
    const url = new URL(process.env.NEXTAUTH_URL)
    finalHost = url.host
    finalProtocol = url.protocol.replace(':', '')

    Object.assign(req.headers, {
      'x-forwarded-host': finalHost, // Host should NOT include path
      'x-forwarded-proto': finalProtocol,
    })
  } else {
    // Fallback: use headers from Vercel (x-forwarded-host is set for custom domains)
    const forwardedHost = req.headers['x-forwarded-host'] as string
    const forwardedProto = req.headers['x-forwarded-proto'] as string

    if (forwardedHost) {
      finalHost = forwardedHost
      finalProtocol = forwardedProto || (process.env.NODE_ENV === 'production' ? 'https' : 'http')

      Object.assign(req.headers, {
        'x-forwarded-host': finalHost,
        'x-forwarded-proto': finalProtocol,
      })
    } else {
      finalHost = req.headers.host
      finalProtocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    }
  }

  return NextAuth(req, res, authOptions)
}
