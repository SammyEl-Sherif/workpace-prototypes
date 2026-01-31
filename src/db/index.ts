import { Pool } from 'pg'

import { pool, supabasePool } from './pool'
import { loadSql } from './sql'

/**
 * Get database connection info for debugging
 * @param connectionPool - The pool to check
 * @returns Object with database connection info
 */
export function getDbInfo(connectionPool?: Pool): {
  type: 'supabase' | 'unknown'
  host?: string
  database?: string
  user?: string
} {
  const poolToCheck = connectionPool || pool

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
 * Execute a SQL query using the specified pool
 * @param sqlPath - Path to the SQL file (e.g., 'restaurants/get_restaurants.sql')
 * @param params - Query parameters
 * @param connectionPool - Optional pool to use. Defaults to Supabase pool
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
    console.log(`[DB Query] Using ${dbInfo.type} database for: ${sqlPath}`)
  }

  try {
    const result = await poolToUse.query<T>(text, params)
    return result.rows
  } catch (error: unknown) {
    const err = error as { message?: string; code?: string }
    // Log database errors with context
    if (process.env.NODE_ENV !== 'production') {
      const dbInfo = getDbInfo(poolToUse)
      console.error(`[DB Query Error]`, {
        database: dbInfo.type,
        sqlPath,
        error: err.message,
        code: err.code,
        host: dbInfo.host,
      })
    }
    throw error
  }
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
 * @returns Promise that resolves if connection is successful
 */
export async function testConnection(connectionPool?: Pool): Promise<void> {
  const poolToTest = connectionPool || pool
  const dbInfo = getDbInfo(poolToTest)

  try {
    await poolToTest.query('SELECT NOW() as current_time')
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DB Connection Test] ✓ Successfully connected to ${dbInfo.type} database`)
    }
  } catch (error: unknown) {
    const err = error as { message?: string; code?: string }
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[DB Connection Test] ✗ Failed to connect to ${dbInfo.type} database:`, {
        error: err.message,
        code: err.code,
        host: dbInfo.host,
      })
    }
    throw error
  }
}

// Export pools for direct access if needed
export { pool, supabasePool } from './pool'
export { loadSql, clearSqlCache } from './sql'
