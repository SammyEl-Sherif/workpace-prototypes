import { createClient } from '@supabase/supabase-js'

/**
 * Creates a Supabase client for server-side use
 * This client uses the service role key and should only be used on the server
 */
export const createSupabaseServerClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_WORKPACE_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.WORKPACE_SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      'Missing Supabase configuration. Please set NEXT_PUBLIC_WORKPACE_SUPABASE_URL and WORKPACE_SUPABASE_SERVICE_ROLE_KEY environment variables.'
    )
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

/**
 * Creates a Supabase client for client-side use
 * This client uses the anon key and should be used in the browser
 */
export const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_WORKPACE_SUPABASE_URL
  const supabaseAnonKey = process.env.WORKPACE_SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase configuration. Please set NEXT_PUBLIC_WORKPACE_SUPABASE_URL and WORKPACE_SUPABASE_SERVICE_ROLE_KEY environment variables.'
    )
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}
