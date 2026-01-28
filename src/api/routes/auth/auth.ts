import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth from 'next-auth/next'

import { getAuthOptions } from '@/server/utils'

export const getNextAuth = (req: NextApiRequest, res: NextApiResponse) => {
  const authOptions = getAuthOptions()

  // Determine the host and protocol
  // Priority: NEXTAUTH_URL > x-forwarded-host header > request URL > host header (filtering Vercel internal domains)
  let host: string
  let protocol: string

  if (process.env.NEXTAUTH_URL) {
    // NEXTAUTH_URL is the most reliable source - use it directly
    const url = new URL(process.env.NEXTAUTH_URL)
    host = url.host
    protocol = url.protocol.replace(':', '')
  } else {
    // Try to get from headers (set by reverse proxy/load balancer/Vercel)
    const forwardedHost = req.headers['x-forwarded-host'] as string
    const forwardedProto = req.headers['x-forwarded-proto'] as string
    const hostHeader = req.headers.host

    // Filter out Vercel internal domains (they end with .vercel.app)
    const isVercelInternalDomain = (h: string | undefined) =>
      h && (h.includes('.vercel.app') || h.includes('.vercel.app:'))

    // Try to extract host from referer header (contains the actual domain user is accessing)
    let refererHost: string | undefined
    try {
      const referer = req.headers.referer || req.headers.referrer
      if (referer && typeof referer === 'string') {
        const url = new URL(referer)
        refererHost = url.host
      }
    } catch {
      // Ignore errors when parsing referer
    }

    // Prefer x-forwarded-host (set by Vercel for custom domains) over host header
    // Only use host header if it's not a Vercel internal domain
    if (forwardedHost) {
      host = forwardedHost
    } else if (refererHost && !isVercelInternalDomain(refererHost)) {
      // Use host from referer if it's not a Vercel internal domain
      // This is useful when x-forwarded-host is not set but user is accessing via custom domain
      host = refererHost
    } else if (hostHeader && !isVercelInternalDomain(hostHeader)) {
      host = hostHeader
    } else {
      // Fallback to HOST env var or default
      // In production on Vercel, this should ideally be set via NEXTAUTH_URL
      // NOTE: If you're using a custom domain, set NEXTAUTH_URL=https://your-custom-domain.com
      host = process.env.HOST || 'localhost:3000'
    }

    // Determine protocol
    if (forwardedProto) {
      protocol = forwardedProto
    } else if (req.headers['x-forwarded-ssl'] === 'on') {
      protocol = 'https'
    } else {
      // Default to https for production, http for development
      protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    }

    // Remove port from host if present and it's a standard port
    if (host.includes(':3000') && protocol === 'http') {
      host = host.replace(':3000', '')
    }
    if (host.includes(':443') && protocol === 'https') {
      host = host.replace(':443', '')
    }
  }

  Object.assign(req.headers, {
    'x-forwarded-host': host,
    'x-forwarded-proto': protocol,
  })

  return NextAuth(req, res, authOptions)
}
