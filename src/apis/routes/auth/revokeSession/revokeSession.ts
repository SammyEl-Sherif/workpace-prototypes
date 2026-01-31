import { SessionAccount } from '@/interfaces/user'
import { createHttpClient, withApiAuth } from '@/server/utils'
import { NextApiRequest, NextApiResponse } from 'next'

export const revokeSession = withApiAuth<NextApiRequest, NextApiResponse>(
  async (req, res, session) => {
    try {
      const authToken = `Basic ${Buffer.from(
        `${process.env.AUTH0_CLIENT_ID}:${process.env.AUTH0_CLIENT_SECRET}`,
        'utf8'
      ).toString('base64')}`

      const url = `${process.env.AUTH0_ISSUER_BASE_URL}/oauth/revoke`

      const params: { token?: string; token_type_hint?: string } = {}

      if (session?.account) {
        const account: SessionAccount | any = session.account
        if (account?.access_token) {
          Object.assign(params, {
            token: account.access_token,
            token_type_hint: 'access_token',
          })
        }
      }

      // Only attempt to revoke if we have a token
      if (params.token) {
        const instance = createHttpClient()

        try {
          const { statusText, status } = await instance.request({
            url,
            method: 'POST',
            headers: {
              Accept: 'application/json',
              Authorization: authToken,
              'Content-Type': 'application/json',
              'cache-control': 'no-cache',
            },
            data: params,
            timeout: 10000, // 10 second timeout
          })

          res.status(200).json({ message: 'Session revoked successfully', status, statusText })
        } catch (error: any) {
          // Log error but don't fail the request - session may already be invalid
          console.error(
            'Error revoking session with Auth0:',
            error?.response?.data || error?.message
          )
          // Still return success to allow sign out to proceed
          res.status(200).json({
            message: 'Sign out completed',
            warning: 'Session revocation may have failed',
            error: error?.response?.data || error?.message,
          })
        }
      } else {
        // No token to revoke, just return success
        res.status(200).json({ message: 'No session token to revoke' })
      }
    } catch (error: any) {
      console.error('Unexpected error in revokeSession:', error)
      // Return success anyway to allow sign out to proceed
      res.status(200).json({
        message: 'Sign out completed',
        warning: 'Session revocation encountered an error',
        error: error?.message,
      })
    }
  }
)
