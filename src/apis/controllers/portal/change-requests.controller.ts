import { NextApiRequest, NextApiResponse } from 'next'

import { HttpResponse } from '@/server/types'
import { withSupabaseAuth } from '@/server/utils'

import { PortalService } from './portal.service'
import { ChangeRequestsService } from './change-requests.service'

export const getChangeRequestsController = withSupabaseAuth(
  async (req: NextApiRequest, res: NextApiResponse<HttpResponse<{ requests: any[] }>>, session) => {
    try {
      if (!session.user) {
        res.status(401).json({ data: { requests: [] }, status: 401 })
        return
      }

      const portalUser = await PortalService.getPortalUser(session.user.id)
      if (!portalUser || portalUser.status !== 'active') {
        res.status(403).json({ data: { requests: [] }, status: 403 })
        return
      }

      const requests = await ChangeRequestsService.getByOrgId(portalUser.org_id)

      res.status(200).json({
        data: { requests },
        status: 200,
      })
    } catch (error: unknown) {
      console.error('[getChangeRequestsController] Error:', error)
      res.status(500).json({
        data: { requests: [] },
        status: 500,
      })
    }
  }
)

export const getChangeRequestController = withSupabaseAuth(
  async (req: NextApiRequest, res: NextApiResponse<HttpResponse<{ request: any }>>, session) => {
    try {
      if (!session.user) {
        res.status(401).json({ data: { request: null }, status: 401 })
        return
      }

      const portalUser = await PortalService.getPortalUser(session.user.id)
      if (!portalUser || portalUser.status !== 'active') {
        res.status(403).json({ data: { request: null }, status: 403 })
        return
      }

      const { id } = req.query
      if (!id || typeof id !== 'string') {
        res.status(400).json({ data: { request: null }, status: 400 })
        return
      }

      const request = await ChangeRequestsService.getById(id)
      if (!request || request.org_id !== portalUser.org_id) {
        res.status(404).json({ data: { request: null }, status: 404 })
        return
      }

      res.status(200).json({
        data: { request },
        status: 200,
      })
    } catch (error: unknown) {
      console.error('[getChangeRequestController] Error:', error)
      res.status(500).json({
        data: { request: null },
        status: 500,
      })
    }
  }
)

export const createChangeRequestController = withSupabaseAuth(
  async (req: NextApiRequest, res: NextApiResponse<HttpResponse<{ request: any }>>, session) => {
    try {
      if (!session.user) {
        res.status(401).json({ data: { request: null }, status: 401 })
        return
      }

      const portalUser = await PortalService.getPortalUser(session.user.id)
      if (!portalUser || portalUser.status !== 'active') {
        res.status(403).json({ data: { request: null }, status: 403 })
        return
      }

      const { title, description, category, priority } = req.body

      if (!title || !description) {
        res.status(400).json({ data: { request: null }, status: 400 })
        return
      }

      const request = await ChangeRequestsService.create(portalUser.org_id, session.user.id, {
        title,
        description,
        category: category || 'other',
        priority: priority || 'medium',
      })

      res.status(201).json({
        data: { request },
        status: 201,
      })
    } catch (error: unknown) {
      console.error('[createChangeRequestController] Error:', error)
      res.status(500).json({
        data: { request: null },
        status: 500,
      })
    }
  }
)
