import { NextApiRequest, NextApiResponse } from 'next'

import { HttpResponse } from '@/server/types'
import { withSupabaseAuth } from '@/server/utils'
import { UserGroup } from '@/interfaces/user'
import { querySupabase } from '@/db'

import { resumeThread } from '@/langgraph/utils/thread-lookup'

import { PortalService } from './portal.service'

export const getPortalUserController = withSupabaseAuth(
  async (req: NextApiRequest, res: NextApiResponse<HttpResponse<{ portalUser: any }>>, session) => {
    try {
      if (!session.user) {
        res.status(401).json({ data: { portalUser: null }, status: 401 })
        return
      }

      const userId = session.user.id
      const portalUser = await PortalService.getPortalUserWithOrg(userId)

      res.status(200).json({
        data: { portalUser },
        status: 200,
      })
    } catch (error: unknown) {
      console.error('[getPortalUserController] Error:', error)
      res.status(500).json({
        data: { portalUser: null },
        status: 500,
      })
    }
  }
)

export const portalSignupController = withSupabaseAuth(
  async (req: NextApiRequest, res: NextApiResponse<HttpResponse<{ result: any }>>, session) => {
    try {
      if (req.method !== 'POST') {
        res.status(405).json({ data: { result: null }, status: 405 })
        return
      }

      if (!session.user) {
        res.status(401).json({ data: { result: null }, status: 401 })
        return
      }

      const userId = session.user.id
      const { org_name } = req.body

      const result = await PortalService.signup(userId, { org_name })

      // Resume the LangGraph pipeline if a thread exists for this user
      try {
        await resumeThread(
          { clientEmail: session.user.email },
          { action: 'account_created', orgId: result?.organization?.id }
        )
      } catch (error) {
        console.warn('[Portal Signup] No pipeline thread for user:', session.user.email)
      }

      res.status(201).json({
        data: { result },
        status: 201,
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      const status =
        errorMessage.includes('required') || errorMessage.includes('already') ? 400 : 500

      res.status(status).json({
        data: { result: null },
        status,
      })
    }
  }
)

const isAdminUser = async (userId: string): Promise<boolean> => {
  const roles = await querySupabase<{ role: string }>('users/get_user_roles.sql', [userId])
  return roles.some((r) => r.role === UserGroup.Admin)
}

export const getPendingPortalUsersController = withSupabaseAuth(
  async (
    req: NextApiRequest,
    res: NextApiResponse<HttpResponse<{ pendingUsers: any[] }>>,
    session
  ) => {
    try {
      if (!session.user) {
        res.status(401).json({ data: { pendingUsers: [] }, status: 401 })
        return
      }

      const adminCheck = await isAdminUser(session.user.id)
      if (!adminCheck) {
        res.status(403).json({ data: { pendingUsers: [] }, status: 403 })
        return
      }

      const pendingUsers = await PortalService.getAllPending()

      res.status(200).json({
        data: { pendingUsers },
        status: 200,
      })
    } catch (error: unknown) {
      console.error('[getPendingPortalUsersController] Error:', error)
      res.status(500).json({
        data: { pendingUsers: [] },
        status: 500,
      })
    }
  }
)

export const approvePortalUserController = withSupabaseAuth(
  async (req: NextApiRequest, res: NextApiResponse<HttpResponse<{ portalUser: any }>>, session) => {
    try {
      if (req.method !== 'PATCH') {
        res.status(405).json({ data: { portalUser: null }, status: 405 })
        return
      }

      if (!session.user) {
        res.status(401).json({ data: { portalUser: null }, status: 401 })
        return
      }

      const adminCheck = await isAdminUser(session.user.id)
      if (!adminCheck) {
        res.status(403).json({ data: { portalUser: null }, status: 403 })
        return
      }

      const { id } = req.query
      if (!id || typeof id !== 'string') {
        res.status(400).json({ data: { portalUser: null }, status: 400 })
        return
      }

      const portalUser = await PortalService.updateStatus(id, 'active')

      res.status(200).json({
        data: { portalUser },
        status: 200,
      })
    } catch (error: unknown) {
      const status = error instanceof Error && error.message.includes('not found') ? 404 : 500
      res.status(status).json({ data: { portalUser: null }, status })
    }
  }
)

export const deactivatePortalUserController = withSupabaseAuth(
  async (req: NextApiRequest, res: NextApiResponse<HttpResponse<{ portalUser: any }>>, session) => {
    try {
      if (req.method !== 'PATCH') {
        res.status(405).json({ data: { portalUser: null }, status: 405 })
        return
      }

      if (!session.user) {
        res.status(401).json({ data: { portalUser: null }, status: 401 })
        return
      }

      const adminCheck = await isAdminUser(session.user.id)
      if (!adminCheck) {
        res.status(403).json({ data: { portalUser: null }, status: 403 })
        return
      }

      const { id } = req.query
      if (!id || typeof id !== 'string') {
        res.status(400).json({ data: { portalUser: null }, status: 400 })
        return
      }

      const portalUser = await PortalService.updateStatus(id, 'deactivated')

      res.status(200).json({
        data: { portalUser },
        status: 200,
      })
    } catch (error: unknown) {
      const status = error instanceof Error && error.message.includes('not found') ? 404 : 500
      res.status(status).json({ data: { portalUser: null }, status })
    }
  }
)
