import { Pool } from 'pg'

// Digital Ocean connection pool
export const doPool = new Pool({
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
  database: process.env.PG_DB,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  ssl:
    process.env.NODE_ENV === 'production'
      ? {
          ca: process.env.DO_CA_CERTIFICATE,
          rejectUnauthorized: false,
        }
      : false,
})

// Supabase connection pool
interface SupabasePoolConfig {
  connectionString?: string
  ssl?: boolean | { rejectUnauthorized: boolean }
}

const supabaseConfig: SupabasePoolConfig = {
  connectionString: process.env.SUPABASE_DB_CONNECTION_STRING,
  // Supabase requires SSL for all connections (including local to production)
  ssl:
    process.env.SUPABASE_DB_SSL === 'false'
      ? false
      : {
          rejectUnauthorized: false,
        },
}

// Validate Supabase configuration
if (!process.env.SUPABASE_DB_CONNECTION_STRING) {
  console.warn(
    '[DB Pool] Supabase connection not configured. Set SUPABASE_DB_CONNECTION_STRING in your .env file'
  )
} else if (process.env.NODE_ENV !== 'production') {
  // Log connection info in development (without password)
  try {
    const connString = process.env.SUPABASE_DB_CONNECTION_STRING
    const url = new URL(connString.replace('postgresql://', 'http://'))
    const port = url.port || '5432'
    const hostname = url.hostname
    const isSessionPooler = port === '5432' && hostname.includes('pooler')
    const isTransactionPooler = port === '6543'
    const isDirectConnection = port === '5432' && !hostname.includes('pooler')

    console.log(
      `[DB Pool] Supabase connection configured: ${hostname}:${port}/${url.pathname.replace(
        '/',
        ''
      )}`
    )

    if (isSessionPooler) {
      console.log(`[DB Pool] ✓ Using Session Pooler (recommended for this Node.js API)`)
    } else if (isTransactionPooler) {
      console.log(
        `[DB Pool] ⚠ Using Transaction Pooler. Consider using Session Pooler (port 5432 with pooler hostname) instead.`
      )
    } else if (isDirectConnection) {
      console.log(
        `[DB Pool] ⚠ Using Direct Connection. Consider using Session Pooler (port 5432 with pooler hostname) for better performance.`
      )
    }

    // Validate connection string format
    if (!hostname || hostname === '') {
      console.error(`[DB Pool] ⚠ WARNING: Hostname is empty in connection string!`)
    }
    if (!url.username || url.username === '') {
      console.error(`[DB Pool] ⚠ WARNING: Username is empty in connection string!`)
    }
    if (!url.password || url.password === '') {
      console.error(`[DB Pool] ⚠ WARNING: Password is empty in connection string!`)
    }
  } catch (e: any) {
    console.error('[DB Pool] ❌ ERROR: Supabase connection string format is invalid!')
    console.error(
      `[DB Pool] Connection string format should be: postgresql://user:password@host:port/database`
    )
    console.error(`[DB Pool] Error: ${e.message}`)
  }
}

export const supabasePool = new Pool(supabaseConfig)

// Add error handler to pool for better debugging
supabasePool.on('error', (err) => {
  console.error('[Supabase Pool] Unexpected error on idle client', err)
})

// Default pool (Digital Ocean) for backward compatibility
export const pool = doPool
