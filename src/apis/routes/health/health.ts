import { NextApiRequest, NextApiResponse } from 'next'
import { testConnection, getDbInfo, doPool, supabasePool } from '@/db'
import { lookup } from 'dns'
import { promisify } from 'util'

const dnsLookup = promisify(lookup)

interface DatabaseStatus {
  status: 'healthy' | 'unhealthy'
  info?: {
    type: string
    host?: string
    database?: string
    user?: string
  }
  error?: string
  code?: string
}

interface DatabaseTestResults {
  status: 'checking' | 'healthy' | 'degraded'
  databases: Record<string, DatabaseStatus>
}

export const healthCheckRoute = async (request: NextApiRequest, response: NextApiResponse) => {
  return response.status(200).json({ message: 'Client is healthy! (k8s)' })
}

// Diagnostic endpoint to check connection string configuration
export const diagnoseDbRoute = async (request: NextApiRequest, response: NextApiResponse) => {
  const connString = process.env.SUPABASE_DB_CONNECTION_STRING

  if (!connString) {
    return response.status(400).json({
      error: 'SUPABASE_DB_CONNECTION_STRING is not set',
      help: 'Set SUPABASE_DB_CONNECTION_STRING in your .env file',
    })
  }

  try {
    // Parse connection string
    const url = new URL(connString.replace('postgresql://', 'http://'))
    const hostname = url.hostname
    const port = url.port || '5432'
    const database = url.pathname.replace('/', '') || 'postgres'
    const user = url.username

    // Test DNS resolution
    let dnsResult = null
    let dnsError = null
    try {
      const addresses = await dnsLookup(hostname)
      dnsResult = {
        resolved: true,
        addresses: Array.isArray(addresses) ? addresses.map((a) => a.address) : [addresses.address],
      }
    } catch (error: any) {
      dnsResult = {
        resolved: false,
        error: error.message,
        code: error.code,
      }
      dnsError = error
    }

    return response.status(200).json({
      connectionString: {
        present: true,
        format: 'valid',
        parsed: {
          hostname,
          port,
          database,
          user: user ? `${user.substring(0, 3)}***` : 'not set',
          hasPassword: !!url.password,
        },
      },
      dns: dnsResult,
      recommendations: dnsError
        ? [
            '1. Verify the hostname is correct in your Supabase dashboard',
            '2. Check if your Supabase project is paused (even if it appears active)',
            '3. Try getting a fresh connection string from: Supabase Dashboard → Settings → Database',
            '4. Verify you are using the correct project (check the PROJECT-REF in the hostname)',
            '5. If using direct connection, ensure the project is not in a paused state',
          ]
        : ['DNS resolution successful - connection should work'],
    })
  } catch (error: any) {
    return response.status(400).json({
      error: 'Invalid connection string format',
      message: error.message,
      connectionString: connString ? `${connString.substring(0, 20)}*** (hidden)` : 'not set',
      help: 'Connection string should be in format: postgresql://user:password@host:port/database',
    })
  }
}

// Database health check endpoint
export const dbHealthCheckRoute = async (request: NextApiRequest, response: NextApiResponse) => {
  const { type } = request.query

  try {
    if (type === 'supabase') {
      const dbInfo = getDbInfo(supabasePool)
      await testConnection(supabasePool)
      return response.status(200).json({
        status: 'healthy',
        database: 'supabase',
        info: dbInfo,
      })
    } else if (type === 'digital-ocean' || type === 'do') {
      const dbInfo = getDbInfo(doPool)
      await testConnection(doPool)
      return response.status(200).json({
        status: 'healthy',
        database: 'digital-ocean',
        info: dbInfo,
      })
    } else {
      // Test both connections
      const results: DatabaseTestResults = {
        status: 'checking',
        databases: {},
      }

      // Test Digital Ocean
      try {
        const doInfo = getDbInfo(doPool)
        await testConnection(doPool)
        results.databases['digital-ocean'] = {
          status: 'healthy',
          info: doInfo,
        }
      } catch (error: any) {
        results.databases['digital-ocean'] = {
          status: 'unhealthy',
          error: error.message,
          code: error.code,
        }
      }

      // Test Supabase
      try {
        const supabaseInfo = getDbInfo(supabasePool)
        await testConnection(supabasePool)
        results.databases['supabase'] = {
          status: 'healthy',
          info: supabaseInfo,
        }
      } catch (error: any) {
        results.databases['supabase'] = {
          status: 'unhealthy',
          error: error.message,
          code: error.code,
        }
      }

      const allHealthy = Object.values(results.databases).every(
        (db: DatabaseStatus) => db.status === 'healthy'
      )
      results.status = allHealthy ? 'healthy' : 'degraded'

      return response.status(allHealthy ? 200 : 503).json(results)
    }
  } catch (error: any) {
    return response.status(503).json({
      status: 'unhealthy',
      database: type || 'all',
      error: error.message,
      code: error.code,
    })
  }
}
