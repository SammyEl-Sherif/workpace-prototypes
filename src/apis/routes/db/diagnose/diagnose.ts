import { lookup } from 'dns'
import { NextApiRequest, NextApiResponse } from 'next'
import { promisify } from 'util'

const dnsLookup = promisify(lookup)

/**
 * GET /api/db/diagnose
 * Public route - no authentication required
 *
 * Diagnoses the Supabase connection string configuration
 */
export const getDbDiagnoseRoute = async (
  _request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  const connString = process.env.SUPABASE_DB_CONNECTION_STRING

  if (!connString) {
    response.status(400).json({
      error: 'SUPABASE_DB_CONNECTION_STRING is not set',
      help: 'Set SUPABASE_DB_CONNECTION_STRING in your environment variables',
    })
    return
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
    } catch (error) {
      const err = error as { message: string; code?: string }
      dnsResult = {
        resolved: false,
        error: err.message,
        code: err.code,
      }
      dnsError = error
    }

    response.status(200).json({
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
            '2. Check if your Supabase project is paused',
            '3. Try getting a fresh connection string from: Supabase Dashboard → Settings → Database',
            '4. Verify you are using the correct project',
          ]
        : ['DNS resolution successful - connection should work'],
    })
  } catch (error) {
    const err = error as { message: string }
    response.status(400).json({
      error: 'Invalid connection string format',
      message: err.message,
      connectionString: connString ? `${connString.substring(0, 20)}*** (hidden)` : 'not set',
      help: 'Connection string should be in format: postgresql://user:password@host:port/database',
    })
  }
}
