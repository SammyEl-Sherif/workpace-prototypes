import { NextApiRequest, NextApiResponse } from 'next'
import { getSupabaseSession } from '@/server/utils'
import {
  getNotionOAuthUrl,
  exchangeNotionCodeForToken,
  saveNotionConnection,
  getNotionConnection,
  deleteNotionConnection,
} from '@/apis/controllers/notion/oauth/oauth'

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
      res.redirect(`/apps/good-stuff-list?error=unauthorized`)
      return
    }

    const oauthUrl = getNotionOAuthUrl()
    res.redirect(oauthUrl)
  } catch (error: any) {
    res.redirect(
      `/apps/good-stuff-list?error=oauth_error&message=${encodeURIComponent(error.message)}`
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

  try {
    const session = await getSupabaseSession(req)
    if (!session?.user) {
      res.redirect(`/apps/good-stuff-list?error=unauthorized`)
      return
    }

    const { code, error: oauthError } = req.query

    if (oauthError) {
      res.redirect(
        `/apps/good-stuff-list?error=oauth_error&message=${encodeURIComponent(String(oauthError))}`
      )
      return
    }

    if (!code || typeof code !== 'string') {
      res.redirect(`/apps/good-stuff-list?error=missing_code`)
      return
    }

    const { data: tokenData, status } = await exchangeNotionCodeForToken(code)

    if (status !== 200 || !tokenData.access_token) {
      console.error('[Notion OAuth] Token exchange failed:', {
        status,
        hasToken: !!tokenData.access_token,
        codeLength: code.length,
      })
      res.redirect(`/apps/good-stuff-list?error=token_exchange_failed`)
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
      res.redirect(`/apps/good-stuff-list?error=save_failed`)
      return
    }

    res.redirect(`/apps/good-stuff-list?notion_connected=true`)
  } catch (error: any) {
    res.redirect(
      `/apps/good-stuff-list?error=callback_error&message=${encodeURIComponent(error.message)}`
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
