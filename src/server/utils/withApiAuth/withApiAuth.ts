import { NextApiRequest, NextApiResponse } from 'next'

import { getNextAuthJWT } from '../getNextAuthJWT'

/**
 * Public API routes that don't require authentication
 *
 * To add a new public route, add it to this array.
 * Routes matching '/api/auth' will match all NextAuth routes (e.g., /api/auth/signin, /api/auth/callback, etc.)
 * Routes marked with (prefix) will match all routes starting with that prefix
 */
export const PUBLIC_API_ROUTES = [
  '/api/health',
  '/api/auth', // All NextAuth routes (prefix match)
  '/api/restaurants', // All restaurant routes (prefix match) - public API
  '/api/db', // All database health routes (prefix match) - public API
] as const

/**
 * Check if an API route is public (doesn't require authentication)
 */
export const isPublicApiRoute = (pathname: string): boolean => {
  return PUBLIC_API_ROUTES.some((route) => {
    // Routes that should match as prefixes (all sub-routes are also public)
    const prefixRoutes = ['/api/auth', '/api/restaurants', '/api/db']
    if (prefixRoutes.includes(route)) {
      return pathname.startsWith(route)
    }
    return pathname === route
  })
}

type AuthenticatedHandler<T extends NextApiRequest, R extends NextApiResponse> = (
  req: T,
  res: R,
  session: NonNullable<Awaited<ReturnType<typeof getNextAuthJWT>>>
) => Promise<void> | void

type Handler<T extends NextApiRequest, R extends NextApiResponse> = (
  req: T,
  res: R
) => Promise<void> | void

/**
 * Wrapper for API route handlers that require authentication
 * Returns 401 if user is not authenticated
 *
 * Use this version if your handler needs access to the session
 */
export const withApiAuth = <T extends NextApiRequest, R extends NextApiResponse>(
  handler: AuthenticatedHandler<T, R>
) => {
  return async (req: T, res: R): Promise<void> => {
    // Get session
    const session = await getNextAuthJWT(req)

    if (!session) {
      res.status(401).json({
        message: 'Unauthorized',
        error: 'Authentication required',
      })
      return
    }

    // Call handler with authenticated session
    return handler(req, res, session)
  }
}

/**
 * Wrapper for API route handlers that require authentication
 * Returns 401 if user is not authenticated
 *
 * Use this version if your handler doesn't need access to the session
 */
export const requireApiAuth = <T extends NextApiRequest, R extends NextApiResponse>(
  handler: Handler<T, R>
) => {
  return async (req: T, res: R): Promise<void> => {
    // Get session
    const session = await getNextAuthJWT(req)

    if (!session) {
      res.status(401).json({
        message: 'Unauthorized',
        error: 'Authentication required',
      })
      return
    }

    // Call handler without session (handler doesn't need it)
    return handler(req, res)
  }
}
