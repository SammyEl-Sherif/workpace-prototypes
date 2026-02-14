import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Singleton instance to prevent multiple GoTrueClient instances
let supabaseClient: SupabaseClient | null = null

/**
 * Client-side Supabase client
 * Use this in React components and client-side code
 *
 * Note: Sessions are stored in cookies by the server (sb-access-token, sb-refresh-token)
 * The client will read from these cookies via the useSupabaseSession hook
 *
 * This function implements a singleton pattern to ensure only one Supabase client
 * instance is created per browser context, preventing the "Multiple GoTrueClient
 * instances detected" warning.
 */
export const getSupabaseClient = (): SupabaseClient => {
  // Return cached instance if it exists
  if (supabaseClient) {
    return supabaseClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_WORKPACE_SUPABASE_URL
  // Client-side code needs NEXT_PUBLIC_ prefix to access env vars in the browser
  // Use the anon/publishable key (safe to expose), not the service role key
  const supabaseAnonKey = process.env.NEXT_PUBLIC_WORKPACE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase configuration. Please set NEXT_PUBLIC_WORKPACE_SUPABASE_URL and NEXT_PUBLIC_WORKPACE_SUPABASE_ANON_KEY environment variables. Get the anon/publishable key from Supabase Dashboard > Settings > API.'
    )
  }

  // Create and cache the client instance
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  })

  return supabaseClient
}
