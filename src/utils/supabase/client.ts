import { createClient } from '@supabase/supabase-js'

/**
 * Client-side Supabase client
 * Use this in React components and client-side code
 *
 * Note: Sessions are stored in cookies by the server (sb-access-token, sb-refresh-token)
 * The client will read from these cookies via the useSupabaseSession hook
 */
export const getSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_WORKPACE_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_WORKPACE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase configuration. Please set NEXT_PUBLIC_WORKPACE_SUPABASE_URL and NEXT_PUBLIC_WORKPACE_SUPABASE_ANON_KEY environment variables.'
    )
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  })
}
