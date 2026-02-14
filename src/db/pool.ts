import { Pool, PoolConfig } from 'pg'

// Supabase connection pool configuration
interface SupabasePoolConfig extends PoolConfig {
  connectionString?: string
  ssl?: boolean | { rejectUnauthorized: boolean }
}

// Determine pool size based on connection mode
// Supabase Session mode (port 5432) has strict limits (typically 1-4 connections)
// Transaction mode (port 6543) allows more connections (typically 15+)
const connectionString = process.env.SUPABASE_DB_CONNECTION_STRING || ''
const isTransactionMode = connectionString.includes(':6543')
const defaultMax = isTransactionMode ? 15 : 4 // Lower limit for session mode

const supabaseConfig: SupabasePoolConfig = {
  connectionString,
  // Supabase requires SSL for all connections
  ssl:
    process.env.SUPABASE_DB_SSL === 'false'
      ? false
      : {
          rejectUnauthorized: false,
        },
  // Connection pool settings to prevent "max clients reached" errors
  // IMPORTANT: For Session mode (port 5432), keep max low (1-4)
  // For Transaction mode (port 6543), you can use higher values (15+)
  max: parseInt(process.env.SUPABASE_POOL_MAX || String(defaultMax), 10),
  min: parseInt(process.env.SUPABASE_POOL_MIN || '1', 10), // Start with 1 connection
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection could not be established
  // Allow the pool to create connections on demand up to max
  allowExitOnIdle: false,
}

// Create the Supabase pool
export const supabasePool = new Pool(supabaseConfig)

// Add error handler for better debugging
supabasePool.on('error', (err) => {
  console.error('[Supabase Pool] Unexpected error on idle client', err)
})

// Log pool statistics in development
if (process.env.NODE_ENV !== 'production' && process.env.DEBUG_DB_POOL === 'true') {
  setInterval(() => {
    console.log('[DB Pool Stats]', {
      totalCount: supabasePool.totalCount,
      idleCount: supabasePool.idleCount,
      waitingCount: supabasePool.waitingCount,
    })
  }, 30000) // Every 30 seconds
}

// Export as default for convenience
export const pool = supabasePool
