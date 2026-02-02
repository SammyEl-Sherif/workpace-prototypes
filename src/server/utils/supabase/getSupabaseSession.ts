import { createClient } from '@supabase/supabase-js'
import { NextApiRequest } from 'next'

/**
 * Gets the Supabase session from the request
 * Extracts the access token from cookies or Authorization header
 */
export const getSupabaseSession = async (req: NextApiRequest) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_WORKPACE_SUPABASE_URL
  // Trim whitespace from the key (common issue when copying from Supabase dashboard)
  const supabaseAnonKey = process.env.NEXT_PUBLIC_WORKPACE_SUPABASE_ANON_KEY?.trim()

  if (!supabaseUrl || !supabaseAnonKey) {
    return null
  }

  // Validate that the anon key looks correct
  // Supabase keys can be:
  // - JWT format: starts with 'eyJ'
  // - Publishable key: starts with 'sb_publishable_' or 'sb_'
  // - Legacy anon key: JWT format
  // Note: Sometimes keys have whitespace or encoding issues, so we check multiple patterns
  const finalAnonKey = supabaseAnonKey // Already trimmed on line 11
  const isValidFormat = 
    finalAnonKey.startsWith('eyJ') || 
    finalAnonKey.startsWith('sb_') ||
    finalAnonKey.includes('sb_publishable_') ||
    finalAnonKey.includes('publishable')
  
  if (!isValidFormat) {
    return null
  }

  // Create a client with anon key for token validation
  // We use anon key because we're validating user tokens, not admin operations
  let supabase
  try {
    supabase = createClient(supabaseUrl, finalAnonKey)
  } catch (error: any) {
    return null
  }

  // Try to get token from Authorization header
  const authHeader = req.headers.authorization
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(token)
      if (!error && user) {
        return { user, accessToken: token }
      }
    } catch (error: any) {
      // Silently fail and try cookies
    }
  }

  // Try to get token from cookies
  // Next.js automatically decodes cookies, but handle edge cases
  let accessToken = req.cookies['sb-access-token'] || null
  let refreshToken = req.cookies['sb-refresh-token'] || null
  
  // Try to decode if it looks URL-encoded (contains %)
  if (accessToken && accessToken.includes('%')) {
    try {
      accessToken = decodeURIComponent(accessToken)
    } catch (e) {
      // If decoding fails, use original value
    }
  }
  if (refreshToken && refreshToken.includes('%')) {
    try {
      refreshToken = decodeURIComponent(refreshToken)
    } catch (e) {
      // If decoding fails, use original value
    }
  }

  if (accessToken) {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(accessToken)
      
      if (!error && user) {
        return { user, accessToken, refreshToken }
      }
      
      // If token is invalid, try to refresh
      if (error && refreshToken) {
        try {
          const { data, error: refreshError } = await supabase.auth.refreshSession({ refresh_token: refreshToken })
          if (!refreshError && data.session) {
            return {
              user: data.user,
              accessToken: data.session.access_token,
              refreshToken: data.session.refresh_token,
            }
          }
        } catch (refreshErr: any) {
          // Silently fail
        }
      }
    } catch (error: any) {
      // Silently fail
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
