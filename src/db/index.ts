import { Pool } from 'pg'
import { lookup } from 'dns'
import { promisify } from 'util'
import { pool, doPool, supabasePool } from './pool'
import { loadSql } from './sql'

const dnsLookup = promisify(lookup)

/**
 * Get database connection info to identify which database is being used
 * @param connectionPool - The pool to check
 * @returns Object with database type and connection info
 */
export function getDbInfo(connectionPool?: Pool): {
  type: 'digital-ocean' | 'supabase' | 'unknown'
  host?: string
  database?: string
  user?: string
} {
  const poolToCheck = connectionPool || pool

  // Check if it's the Digital Ocean pool
  if (poolToCheck === doPool) {
    return {
      type: 'digital-ocean',
      host: process.env.PG_HOST,
      database: process.env.PG_DB,
      user: process.env.PG_USER,
    }
  }

  // Check if it's the Supabase pool
  if (poolToCheck === supabasePool) {
    const connString = process.env.SUPABASE_DB_CONNECTION_STRING
    if (connString) {
      try {
        const url = new URL(connString.replace('postgresql://', 'http://'))
        return {
          type: 'supabase',
          host: url.hostname,
          database: url.pathname.replace('/', ''),
          user: url.username,
        }
      } catch {
        return {
          type: 'supabase',
          host: 'supabase',
          database: 'supabase',
          user: 'supabase',
        }
      }
    }
    return {
      type: 'supabase',
      host: 'not configured',
      database: 'not configured',
      user: 'not configured',
    }
  }

  return { type: 'unknown' }
}

/**
 * Execute a SQL query using the specified pool or default pool (Digital Ocean)
 * @param sqlPath - Path to the SQL file (e.g., 'restaurants/get_restaurants.sql')
 * @param params - Query parameters
 * @param connectionPool - Optional pool to use. If not provided, uses default (Digital Ocean) pool
 * @returns Array of query results
 */
export async function query<T = unknown>(
  sqlPath: string,
  params: unknown[] = [],
  connectionPool?: Pool
): Promise<T[]> {
  const text = loadSql(sqlPath)
  const poolToUse = connectionPool || pool

  // Log which database is being used (only in development)
  if (process.env.NODE_ENV !== 'production') {
    const dbInfo = getDbInfo(poolToUse)
    console.log(
      `[DB Query] Using ${dbInfo.type} database (${dbInfo.database || 'unknown'}) for: ${sqlPath}`
    )
  }

  try {
    const result = await poolToUse.query<T>(text, params)
    return result.rows
  } catch (error: any) {
    // Log database errors with context
    if (process.env.NODE_ENV !== 'production') {
      const dbInfo = getDbInfo(poolToUse)
      console.error(`[DB Query Error]`, {
        database: dbInfo.type,
        sqlPath,
        error: error.message,
        code: error.code,
        host: dbInfo.host,
        params: params.length > 0 ? params : undefined,
      })

      // Provide specific guidance for common errors
      if (error.code === 'ENOTFOUND') {
        console.error(
          `\n[DB Query Error] Connection failed - Hostname not found: ${dbInfo.host}\n` +
            `  → Check if your Supabase project is active (not paused)\n` +
            `  → Verify SUPABASE_DB_CONNECTION_STRING in your .env file\n` +
            `  → Get a fresh connection string from Supabase Dashboard\n`
        )
      } else if (error.code === 'ECONNREFUSED') {
        console.error(
          `\n[DB Query Error] Connection refused: ${dbInfo.host}\n` +
            `  → Check if the database server is running\n` +
            `  → Verify the port number is correct\n` +
            `  → Check firewall/network settings\n`
        )
      }
    }
    throw error
  }
}

/**
 * Execute a SQL query using the Digital Ocean connection pool
 */
export async function queryDO<T = unknown>(sqlPath: string, params: unknown[] = []): Promise<T[]> {
  return query<T>(sqlPath, params, doPool)
}

/**
 * Execute a SQL query using the Supabase connection pool
 */
export async function querySupabase<T = unknown>(
  sqlPath: string,
  params: unknown[] = []
): Promise<T[]> {
  return query<T>(sqlPath, params, supabasePool)
}

/**
 * Test database connection
 * @param connectionPool - The pool to test
 * @returns Promise that resolves if connection is successful, rejects otherwise
 */
export async function testConnection(connectionPool?: Pool): Promise<void> {
  const poolToTest = connectionPool || pool
  const dbInfo = getDbInfo(poolToTest)

  try {
    await poolToTest.query('SELECT NOW() as current_time')
    if (process.env.NODE_ENV !== 'production') {
      console.log(
        `[DB Connection Test] ✓ Successfully connected to ${dbInfo.type} database (${
          dbInfo.database || 'unknown'
        })`
      )
    }
    return Promise.resolve()
  } catch (error: any) {
    const errorMessage = error.message || 'Unknown error'
    const errorCode = error.code || 'UNKNOWN'

    if (process.env.NODE_ENV !== 'production') {
      console.error(`[DB Connection Test] ✗ Failed to connect to ${dbInfo.type} database:`, {
        error: errorMessage,
        code: errorCode,
        host: dbInfo.host,
        database: dbInfo.database,
      })

      if (errorCode === 'ENOTFOUND') {
        console.error(
          `[DB Connection Test] Troubleshooting:\n` +
            `  1. Check if your Supabase project is active (not paused)\n` +
            `  2. Verify your SUPABASE_DB_CONNECTION_STRING in .env\n` +
            `  3. Get a fresh connection string from: Supabase Dashboard → Settings → Database\n` +
            `  4. Ensure the hostname "${dbInfo.host}" is correct`
        )

        // Try DNS lookup to verify hostname resolution
        if (dbInfo.host) {
          try {
            await dnsLookup(dbInfo.host)
            console.error(
              `[DB Connection Test] DNS lookup: ✓ Hostname "${dbInfo.host}" resolves to an IP address\n` +
                `  → This suggests the project might be paused or the connection string is incorrect`
            )
          } catch {
            console.error(
              `[DB Connection Test] DNS lookup: ✗ Hostname "${dbInfo.host}" cannot be resolved\n` +
                `  → This confirms the hostname is invalid or the project is paused/deleted`
            )
          }
        }
      }
    }
    throw error
  }
}

// Export pools for direct access if needed
export { pool, doPool, supabasePool } from './pool'
