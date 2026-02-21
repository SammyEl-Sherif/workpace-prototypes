import { NextApiRequest, NextApiResponse } from 'next'
import { getSupabaseSession } from '@/server/utils'
import {
  getNotionOAuthUrl,
  exchangeNotionCodeForToken,
  saveNotionConnection,
  getNotionConnection,
  deleteNotionConnection,
} from '@/apis/controllers/notion/oauth/oauth'

const DEFAULT_REDIRECT = '/apps/good-stuff-list'
const REDIRECT_COOKIE = 'notion_oauth_redirect'

// Validates that the redirect path is a safe internal path
const getSafeRedirect = (redirect: string | undefined | null): string => {
  if (!redirect || typeof redirect !== 'string') return DEFAULT_REDIRECT
  // Only allow relative paths starting with /
  if (!redirect.startsWith('/')) return DEFAULT_REDIRECT
  // Block protocol-relative URLs
  if (redirect.startsWith('//')) return DEFAULT_REDIRECT
  return redirect
}

export const getNotionOAuthUrlRoute = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    res.status(405).json({ message: 'Method not allowed' })
    return
  }

  try {
    const session = await getSupabaseSession(req)
    if (!session?.user) {
      res.redirect(`${DEFAULT_REDIRECT}?error=unauthorized`)
      return
    }

    const redirect = getSafeRedirect(req.query.redirect as string)
    res.setHeader(
      'Set-Cookie',
      `${REDIRECT_COOKIE}=${encodeURIComponent(
        redirect
      )}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600`
    )

    const oauthUrl = getNotionOAuthUrl()
    res.redirect(oauthUrl)
  } catch (error: any) {
    res.redirect(
      `${DEFAULT_REDIRECT}?error=oauth_error&message=${encodeURIComponent(error.message)}`
    )
  }
}

export const notionOAuthCallbackRoute = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    res.status(405).json({ message: 'Method not allowed' })
    return
  }

  // Read redirect from cookie, then clear it
  const cookies = req.headers.cookie || ''
  const redirectMatch = cookies.match(new RegExp(`${REDIRECT_COOKIE}=([^;]+)`))
  const redirectPath = redirectMatch
    ? getSafeRedirect(decodeURIComponent(redirectMatch[1]))
    : DEFAULT_REDIRECT
  const clearCookie = `${REDIRECT_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`

  try {
    const session = await getSupabaseSession(req)
    if (!session?.user) {
      res.setHeader('Set-Cookie', clearCookie)
      res.redirect(`${redirectPath}?error=unauthorized`)
      return
    }

    const { code, error: oauthError } = req.query

    if (oauthError) {
      res.setHeader('Set-Cookie', clearCookie)
      res.redirect(
        `${redirectPath}?error=oauth_error&message=${encodeURIComponent(String(oauthError))}`
      )
      return
    }

    if (!code || typeof code !== 'string') {
      res.setHeader('Set-Cookie', clearCookie)
      res.redirect(`${redirectPath}?error=missing_code`)
      return
    }

    const { data: tokenData, status } = await exchangeNotionCodeForToken(code)

    if (status !== 200 || !tokenData.access_token) {
      console.error('[Notion OAuth] Token exchange failed:', {
        status,
        hasToken: !!tokenData.access_token,
        codeLength: code.length,
      })
      res.setHeader('Set-Cookie', clearCookie)
      res.redirect(`${redirectPath}?error=token_exchange_failed`)
      return
    }

    const { data: connectionData, status: saveStatus } = await saveNotionConnection(
      session.user.id,
      tokenData.access_token,
      tokenData.workspace_id,
      tokenData.workspace_name,
      tokenData.bot_id,
      tokenData.notion_user_id
    )

    if (saveStatus !== 200 && saveStatus !== 201) {
      res.setHeader('Set-Cookie', clearCookie)
      res.redirect(`${redirectPath}?error=save_failed`)
      return
    }

    res.setHeader('Set-Cookie', clearCookie)
    res.redirect(`${redirectPath}?notion_connected=true`)
  } catch (error: any) {
    res.setHeader('Set-Cookie', clearCookie)
    res.redirect(
      `${redirectPath}?error=callback_error&message=${encodeURIComponent(error.message)}`
    )
  }
}

export const getNotionConnectionStatusRoute = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    res.status(405).json({ message: 'Method not allowed' })
    return
  }

  try {
    const session = await getSupabaseSession(req)
    if (!session?.user) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const { data, status } = await getNotionConnection(session.user.id)
    res.status(status).json(data)
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to get connection status' })
  }
}

export const disconnectNotionRoute = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== 'DELETE') {
    res.setHeader('Allow', 'DELETE')
    res.status(405).json({ message: 'Method not allowed' })
    return
  }

  try {
    const session = await getSupabaseSession(req)
    if (!session?.user) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const { data, status } = await deleteNotionConnection(session.user.id)
    res.status(status).json(data)
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to disconnect Notion' })
  }
}
