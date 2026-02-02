import { NextApiRequest, NextApiResponse } from 'next'

import { getSupabaseSession } from '../supabase'

type AuthenticatedHandler<T extends NextApiRequest, R extends NextApiResponse> = (
  req: T,
  res: R,
  session: NonNullable<Awaited<ReturnType<typeof getSupabaseSession>>>
) => Promise<void> | void

type Handler<T extends NextApiRequest, R extends NextApiResponse> = (
  req: T,
  res: R
) => Promise<void> | void

/**
 * Wrapper for API route handlers that require Supabase authentication
 * Returns 401 if user is not authenticated
 *
 * Use this version if your handler needs access to the session
 */
export const withSupabaseAuth = <T extends NextApiRequest, R extends NextApiResponse>(
  handler: AuthenticatedHandler<T, R>
) => {
  return async (req: T, res: R): Promise<void> => {
    // Get Supabase session
    const session = await getSupabaseSession(req)

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
 * Wrapper for API route handlers that require Supabase authentication
 * Returns 401 if user is not authenticated
 *
 * Use this version if your handler doesn't need access to the session
 */
export const requireSupabaseAuth = <T extends NextApiRequest, R extends NextApiResponse>(
  handler: Handler<T, R>
) => {
  return async (req: T, res: R): Promise<void> => {
    // Get Supabase session
    const session = await getSupabaseSession(req)

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
