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
 * Logout endpoint that handles Auth0 logout
 * This ensures the user is logged out from Auth0, not just the local app session
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

    // Get base URL from current request (dynamically detects localhost, dev, or prod)
    // This will be just the origin (e.g., http://localhost:3000, https://dev.workpace.io, https://workpace.io)
    const baseUrl = getBaseUrlFromRequest(req)
    // Ensure no trailing slash
    const returnToUrl = baseUrl.replace(/\/$/, '')

    // Construct Auth0 logout URL
    const auth0IssuerBaseUrl = process.env.AUTH0_ISSUER_BASE_URL
    const auth0ClientId = process.env.AUTH0_CLIENT_ID

    if (!auth0IssuerBaseUrl || !auth0ClientId) {
      console.error(
        'Missing Auth0 configuration for logout - AUTH0_ISSUER_BASE_URL or AUTH0_CLIENT_ID not set'
      )
      // Fallback: just redirect to base URL (landing page)
      res.redirect(returnToUrl)
      return
    }

    // Build Auth0 logout URL with returnTo parameter
    // returnTo is just the base URL (landing page) without any path or trailing slash
    // This ensures Auth0 session is terminated and user is redirected back to our landing page
    // Note: NextAuth cookies are already cleared by the client-side signOut call
    const auth0LogoutUrl = `${auth0IssuerBaseUrl}/v2/logout?client_id=${auth0ClientId}&returnTo=${encodeURIComponent(
      returnToUrl
    )}`

    // Redirect directly to Auth0 logout endpoint
    // Auth0 will clear their session and redirect back to our callbackUrl
    res.redirect(auth0LogoutUrl)
  } catch (error) {
    console.error('Error in logout endpoint:', error)
    // On error, redirect to base URL (landing page)
    const baseUrl = getBaseUrlFromRequest(req)
    const returnToUrl = baseUrl.replace(/\/$/, '')
    res.redirect(returnToUrl)
  }
}
