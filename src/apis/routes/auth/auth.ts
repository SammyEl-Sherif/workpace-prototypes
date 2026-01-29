import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth from 'next-auth/next'

import { getAuthOptions } from '@/server/utils'

export const getNextAuth = (req: NextApiRequest, res: NextApiResponse) => {
  const authOptions = getAuthOptions()

  // Logging for debugging in Vercel
  console.log('=== NextAuth Request Debug ===')
  console.log('Request Method:', req.method)
  console.log('Request URL:', req.url)
  console.log('Request Path:', req.url?.split('?')[0])

  // Log environment variables
  console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL || 'NOT SET')
  console.log('NODE_ENV:', process.env.NODE_ENV)

  // Log relevant headers
  console.log('Headers:')
  console.log('  host:', req.headers.host)
  console.log('  x-forwarded-host:', req.headers['x-forwarded-host'] || 'NOT SET')
  console.log('  x-forwarded-proto:', req.headers['x-forwarded-proto'] || 'NOT SET')
  console.log('  referer:', req.headers.referer || 'NOT SET')
  console.log('  origin:', req.headers.origin || 'NOT SET')

  // Determine host and protocol
  let finalHost: string | undefined
  let finalProtocol: string | undefined

  // Use NEXTAUTH_URL if set (recommended for Vercel custom domains)
  // Otherwise, use x-forwarded-host from Vercel or fall back to host header
  if (process.env.NEXTAUTH_URL) {
    const url = new URL(process.env.NEXTAUTH_URL)
    finalHost = url.host
    finalProtocol = url.protocol.replace(':', '')
    console.log('Using NEXTAUTH_URL:', { host: finalHost, protocol: finalProtocol })

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
      console.log('Using x-forwarded-host:', { host: finalHost, protocol: finalProtocol })

      Object.assign(req.headers, {
        'x-forwarded-host': finalHost,
        'x-forwarded-proto': finalProtocol,
      })
    } else {
      console.log('WARNING: No NEXTAUTH_URL and no x-forwarded-host header found!')
      console.log('Falling back to host header:', req.headers.host)
      finalHost = req.headers.host
      finalProtocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    }
  }

  // Log final configuration
  console.log('Final Configuration:')
  console.log('  x-forwarded-host:', req.headers['x-forwarded-host'])
  console.log('  x-forwarded-proto:', req.headers['x-forwarded-proto'])
  console.log(
    '  Expected base URL:',
    `${req.headers['x-forwarded-proto']}://${req.headers['x-forwarded-host']}`
  )
  console.log('=== End Debug ===')

  return NextAuth(req, res, authOptions)
}
