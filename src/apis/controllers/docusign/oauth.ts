import crypto from 'crypto'

import { querySupabase } from '@/db'
import { DocuSignConnection, DocuSignTokenResponse, DocuSignUserInfo } from '@/interfaces/docusign'

const getDocuSignBaseUrl = (): string => {
  const env = process.env.DOCUSIGN_ENV || 'demo'
  return env === 'production' ? 'https://account.docusign.com' : 'https://account-d.docusign.com'
}

const getDocuSignApiBaseUrl = (baseUri: string): string => {
  return `${baseUri}/restapi`
}

export const generatePKCE = (): { codeVerifier: string; codeChallenge: string } => {
  const codeVerifier = crypto.randomBytes(32).toString('base64url')
  const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url')
  return { codeVerifier, codeChallenge }
}

export const getDocuSignOAuthUrl = (orgId: string, codeChallenge: string): string => {
  const clientId = process.env.DOCUSIGN_CLIENT_ID
  const redirectUri =
    process.env.DOCUSIGN_REDIRECT_URI ||
    `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/docusign/oauth/callback`

  if (!clientId) {
    throw new Error('DOCUSIGN_CLIENT_ID is not configured')
  }

  const params = new URLSearchParams({
    response_type: 'code',
    scope: 'signature',
    client_id: clientId,
    redirect_uri: redirectUri,
    state: orgId,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  })

  return `${getDocuSignBaseUrl()}/oauth/auth?${params.toString()}`
}

export const exchangeDocuSignCodeForToken = async (
  code: string,
  codeVerifier: string
): Promise<DocuSignTokenResponse> => {
  const clientId = process.env.DOCUSIGN_CLIENT_ID
  const clientSecret = process.env.DOCUSIGN_CLIENT_SECRET
  const redirectUri =
    process.env.DOCUSIGN_REDIRECT_URI ||
    `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/docusign/oauth/callback`

  if (!clientId || !clientSecret) {
    throw new Error('DocuSign OAuth credentials are not configured')
  }

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const response = await fetch(`${getDocuSignBaseUrl()}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${basicAuth}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('[DocuSign OAuth] Token exchange failed:', {
      status: response.status,
      error: errorText,
    })
    throw new Error('Failed to exchange DocuSign authorization code')
  }

  return response.json()
}

export const getDocuSignUserInfo = async (accessToken: string): Promise<DocuSignUserInfo> => {
  const response = await fetch(`${getDocuSignBaseUrl()}/oauth/userinfo`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to get DocuSign user info')
  }

  return response.json()
}

export const saveDocuSignConnection = async (
  orgId: string,
  userId: string,
  tokens: DocuSignTokenResponse,
  accountId: string,
  baseUri: string
): Promise<DocuSignConnection> => {
  const tokenExpiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString()

  const results = await querySupabase<DocuSignConnection>('docusign_connections/upsert.sql', [
    orgId,
    tokens.access_token,
    tokens.refresh_token,
    tokenExpiresAt,
    accountId,
    baseUri,
    userId,
  ])

  if (results.length === 0) {
    throw new Error('Failed to save DocuSign connection')
  }

  return results[0]
}

export const refreshDocuSignToken = async (orgId: string): Promise<DocuSignConnection> => {
  const clientId = process.env.DOCUSIGN_CLIENT_ID
  const clientSecret = process.env.DOCUSIGN_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('DocuSign OAuth credentials are not configured')
  }

  const connections = await querySupabase<DocuSignConnection>(
    'docusign_connections/get_by_org_id.sql',
    [orgId]
  )

  if (connections.length === 0) {
    throw new Error('No DocuSign connection found for this organization')
  }

  const connection = connections[0]
  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const response = await fetch(`${getDocuSignBaseUrl()}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${basicAuth}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: connection.refresh_token,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('[DocuSign OAuth] Token refresh failed:', {
      status: response.status,
      error: errorText,
    })
    throw new Error('Failed to refresh DocuSign token')
  }

  const tokens: DocuSignTokenResponse = await response.json()
  const tokenExpiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString()

  const results = await querySupabase<DocuSignConnection>('docusign_connections/upsert.sql', [
    orgId,
    tokens.access_token,
    tokens.refresh_token,
    tokenExpiresAt,
    connection.account_id,
    connection.base_uri,
    connection.connected_by,
  ])

  if (results.length === 0) {
    throw new Error('Failed to update DocuSign connection')
  }

  return results[0]
}

export const getDocuSignClient = async (
  orgId: string
): Promise<{ accessToken: string; accountId: string; baseUri: string }> => {
  const connections = await querySupabase<DocuSignConnection>(
    'docusign_connections/get_by_org_id.sql',
    [orgId]
  )

  if (connections.length === 0) {
    throw new Error('No DocuSign connection found for this organization')
  }

  let connection = connections[0]

  // Auto-refresh if token is expired or about to expire (within 5 minutes)
  const expiresAt = new Date(connection.token_expires_at)
  const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000)

  if (expiresAt <= fiveMinutesFromNow) {
    connection = await refreshDocuSignToken(orgId)
  }

  return {
    accessToken: connection.access_token,
    accountId: connection.account_id,
    baseUri: getDocuSignApiBaseUrl(connection.base_uri),
  }
}

export const getDocuSignConnectionByOrgId = async (
  orgId: string
): Promise<DocuSignConnection | null> => {
  const results = await querySupabase<DocuSignConnection>(
    'docusign_connections/get_by_org_id.sql',
    [orgId]
  )
  return results.length > 0 ? results[0] : null
}

export const deleteDocuSignConnection = async (orgId: string): Promise<void> => {
  await querySupabase('docusign_connections/delete_by_org_id.sql', [orgId])
}
