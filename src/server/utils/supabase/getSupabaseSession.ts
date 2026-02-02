import { NextApiRequest } from 'next'
import { createClient } from '@supabase/supabase-js'

/**
 * Gets the Supabase session from the request
 * Extracts the access token from cookies or Authorization header
 */
export const getSupabaseSession = async (req: NextApiRequest) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_WORKPACE_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_WORKPACE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return null
  }

  // Create a client with anon key for token validation
  // We use anon key because we're validating user tokens, not admin operations
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  // Try to get token from Authorization header
  const authHeader = req.headers.authorization
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token)
    if (!error && user) {
      return { user, accessToken: token }
    }
  }

  // Try to get token from cookies
  const accessToken = req.cookies['sb-access-token']
  const refreshToken = req.cookies['sb-refresh-token']

  if (accessToken) {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(accessToken)
    if (!error && user) {
      return { user, accessToken, refreshToken }
    }
  }

  // Try to refresh if we have refresh token
  if (refreshToken && !accessToken) {
    const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken })
    if (!error && data.session) {
      return {
        user: data.user,
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
      }
    }
  }

  return null
}
