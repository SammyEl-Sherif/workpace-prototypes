import { NextApiRequest, NextApiResponse } from 'next'

/**
 * Gets the base URL from the current request
 * Handles localhost, dev, and prod environments dynamically
 */
const getBaseUrlFromRequest = (req: NextApiRequest): string => {
  // Prefer origin header (most reliable for client requests)
  if (req.headers.origin) {
    return req.headers.origin
  }

  // Check for forwarded headers (used by proxies like Vercel)
  const forwardedHost = req.headers['x-forwarded-host'] as string
  const forwardedProto = req.headers['x-forwarded-proto'] as string

  if (forwardedHost) {
    const protocol = forwardedProto || (process.env.NODE_ENV === 'production' ? 'https' : 'http')
    return `${protocol}://${forwardedHost}`
  }

  // Fall back to host header
  const host = req.headers.host
  if (host) {
    // Determine protocol based on environment or headers
    const protocol =
      forwardedProto ||
      (req.headers['x-forwarded-ssl'] === 'on' ? 'https' : undefined) ||
      (process.env.NODE_ENV === 'production' ? 'https' : 'http')
    return `${protocol}://${host}`
  }

  // Last resort: use NEXTAUTH_URL or environment defaults
  if (process.env.NEXTAUTH_URL) {
    try {
      const url = new URL(process.env.NEXTAUTH_URL)
      return url.origin
    } catch {
      // If NEXTAUTH_URL is malformed, fall through
    }
  }

  // Final fallback
  return process.env.NODE_ENV === 'production' ? 'https://workpace.io' : 'http://localhost:3000'
}

/**
 * Logout endpoint - redirects to signin page
 * Supabase and NextAuth sessions are cleared by their respective signout endpoints
 *
 * This endpoint should be accessible without authentication (public route)
 */
export const logout = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  try {
    // Only allow GET requests (for redirects)
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET')
      res.status(405).json({ message: 'Method not allowed' })
      return
    }

    // Get base URL from current request
    const baseUrl = getBaseUrlFromRequest(req)
    const returnToUrl = baseUrl.replace(/\/$/, '')

    // Get callback URL from query params or default to signin
    const callbackUrl = (req.query.callbackUrl as string) || '/signin'
    const signinUrl = `${returnToUrl}${callbackUrl}`

    // Redirect to signin page
    res.redirect(signinUrl)
  } catch (error) {
    console.error('Error in logout endpoint:', error)
    // On error, redirect to signin
    const baseUrl = getBaseUrlFromRequest(req)
    const returnToUrl = baseUrl.replace(/\/$/, '')
    res.redirect(`${returnToUrl}/signin`)
  }
}
