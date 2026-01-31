import { Pool } from 'pg'

// Supabase connection pool configuration
interface SupabasePoolConfig {
  connectionString?: string
  ssl?: boolean | { rejectUnauthorized: boolean }
}

const supabaseConfig: SupabasePoolConfig = {
  connectionString: process.env.SUPABASE_DB_CONNECTION_STRING,
  // Supabase requires SSL for all connections
  ssl:
    process.env.SUPABASE_DB_SSL === 'false'
      ? false
      : {
          rejectUnauthorized: false,
        },
}

// Create the Supabase pool
export const supabasePool = new Pool(supabaseConfig)

// Add error handler for better debugging
supabasePool.on('error', (err) => {
  console.error('[Supabase Pool] Unexpected error on idle client', err)
})

// Export as default for convenience
export const pool = supabasePool
