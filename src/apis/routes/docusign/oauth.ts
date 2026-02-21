import { NextApiRequest, NextApiResponse } from 'next'

import { getSupabaseSession } from '@/server/utils'
import { PortalService } from '@/apis/controllers/portal/portal.service'
import {
  getDocuSignOAuthUrl,
  generatePKCE,
  exchangeDocuSignCodeForToken,
  getDocuSignUserInfo,
  saveDocuSignConnection,
  getDocuSignConnectionByOrgId,
  deleteDocuSignConnection,
} from '@/apis/controllers/docusign/oauth'

export const getDocuSignOAuthUrlRoute = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  try {
    const session = await getSupabaseSession(req)
    if (!session?.user) {
      res.redirect('/portal/settings?error=unauthorized')
      return
    }

    const portalUser = await PortalService.getPortalUser(session.user.id)
    if (!portalUser || portalUser.status !== 'active' || portalUser.role !== 'admin') {
      res.redirect('/portal/settings?error=admin_required')
      return
    }

    const { codeVerifier, codeChallenge } = generatePKCE()
    const oauthUrl = getDocuSignOAuthUrl(portalUser.org_id, codeChallenge)

    res.setHeader('Set-Cookie', [
      `docusign_code_verifier=${codeVerifier}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600`,
    ])
    res.redirect(oauthUrl)
  } catch (error: any) {
    console.error('[DocuSign OAuth] Authorize error:', error)
    res.redirect(`/portal/settings?error=oauth_error&message=${encodeURIComponent(error.message)}`)
  }
}

export const docuSignOAuthCallbackRoute = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  try {
    const session = await getSupabaseSession(req)
    if (!session?.user) {
      res.redirect('/portal/settings?error=unauthorized')
      return
    }

    const { code, error: oauthError, state: orgId } = req.query

    if (oauthError) {
      res.redirect(
        `/portal/settings?error=oauth_error&message=${encodeURIComponent(String(oauthError))}`
      )
      return
    }

    if (!code || typeof code !== 'string') {
      res.redirect('/portal/settings?error=missing_code')
      return
    }

    if (!orgId || typeof orgId !== 'string') {
      res.redirect('/portal/settings?error=missing_state')
      return
    }

    // Verify user is admin of the org in the state param
    const portalUser = await PortalService.getPortalUser(session.user.id)
    if (!portalUser || portalUser.org_id !== orgId || portalUser.role !== 'admin') {
      res.redirect('/portal/settings?error=unauthorized')
      return
    }

    // Extract PKCE code verifier from cookie
    const cookies = req.headers.cookie || ''
    const codeVerifierMatch = cookies.match(/docusign_code_verifier=([^;]+)/)
    const codeVerifier = codeVerifierMatch?.[1]

    if (!codeVerifier) {
      res.redirect('/portal/settings?error=missing_code_verifier')
      return
    }

    // Clear the PKCE cookie
    res.setHeader('Set-Cookie', [
      'docusign_code_verifier=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0',
    ])

    const tokens = await exchangeDocuSignCodeForToken(code, codeVerifier)

    const userInfo = await getDocuSignUserInfo(tokens.access_token)
    const defaultAccount = userInfo.accounts.find((a) => a.is_default) || userInfo.accounts[0]

    if (!defaultAccount) {
      res.redirect('/portal/settings?error=no_docusign_account')
      return
    }

    await saveDocuSignConnection(
      orgId,
      session.user.id,
      tokens,
      defaultAccount.account_id,
      defaultAccount.base_uri
    )

    res.redirect('/portal/settings?docusign_connected=true')
  } catch (error: any) {
    console.error('[DocuSign OAuth] Callback error:', error)
    res.redirect(
      `/portal/settings?error=callback_error&message=${encodeURIComponent(error.message)}`
    )
  }
}

export const getDocuSignConnectionStatusRoute = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  try {
    const session = await getSupabaseSession(req)
    if (!session?.user) {
      res.status(401).json({ data: { connected: false }, status: 401 })
      return
    }

    const portalUser = await PortalService.getPortalUser(session.user.id)
    if (!portalUser || portalUser.status !== 'active') {
      res.status(403).json({ data: { connected: false }, status: 403 })
      return
    }

    const connection = await getDocuSignConnectionByOrgId(portalUser.org_id)
    res.status(200).json({
      data: {
        connected: !!connection,
        account_id: connection?.account_id || null,
      },
      status: 200,
    })
  } catch (error: any) {
    console.error('[DocuSign OAuth] Status error:', error)
    res.status(500).json({ data: { connected: false }, status: 500 })
  }
}

export const disconnectDocuSignRoute = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  try {
    const session = await getSupabaseSession(req)
    if (!session?.user) {
      res.status(401).json({ data: { success: false }, status: 401 })
      return
    }

    const portalUser = await PortalService.getPortalUser(session.user.id)
    if (!portalUser || portalUser.status !== 'active' || portalUser.role !== 'admin') {
      res.status(403).json({ data: { success: false }, status: 403 })
      return
    }

    await deleteDocuSignConnection(portalUser.org_id)
    res.status(200).json({ data: { success: true }, status: 200 })
  } catch (error: any) {
    console.error('[DocuSign OAuth] Disconnect error:', error)
    res.status(500).json({ data: { success: false }, status: 500 })
  }
}
