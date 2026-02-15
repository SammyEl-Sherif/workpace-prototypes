import { NextApiRequest, NextApiResponse } from 'next'

import { HttpResponse } from '@/server/types'
import { withSupabaseAuth } from '@/server/utils'

import { PortalService } from './portal.service'
import { IntakeService } from './intake.service'

export const getIntakeController = withSupabaseAuth(
  async (req: NextApiRequest, res: NextApiResponse<HttpResponse<{ submission: any }>>, session) => {
    try {
      if (!session.user) {
        res.status(401).json({ data: { submission: null }, status: 401 })
        return
      }

      const portalUser = await PortalService.getPortalUser(session.user.id)
      if (!portalUser || portalUser.status !== 'active') {
        res.status(403).json({ data: { submission: null }, status: 403 })
        return
      }

      const submission = await IntakeService.getByOrgId(portalUser.org_id)

      res.status(200).json({
        data: { submission },
        status: 200,
      })
    } catch (error: unknown) {
      console.error('[getIntakeController] Error:', error)
      res.status(500).json({
        data: { submission: null },
        status: 500,
      })
    }
  }
)

export const saveIntakeDraftController = withSupabaseAuth(
  async (req: NextApiRequest, res: NextApiResponse<HttpResponse<{ submission: any }>>, session) => {
    try {
      if (!session.user) {
        res.status(401).json({ data: { submission: null }, status: 401 })
        return
      }

      const portalUser = await PortalService.getPortalUser(session.user.id)
      if (!portalUser || portalUser.status !== 'active') {
        res.status(403).json({ data: { submission: null }, status: 403 })
        return
      }

      const { company_info, tools_tech, goals_needs } = req.body

      const submission = await IntakeService.saveDraft(portalUser.org_id, session.user.id, {
        company_info,
        tools_tech,
        goals_needs,
      })

      res.status(200).json({
        data: { submission },
        status: 200,
      })
    } catch (error: unknown) {
      console.error('[saveIntakeDraftController] Error:', error)
      res.status(500).json({
        data: { submission: null },
        status: 500,
      })
    }
  }
)

export const submitIntakeController = withSupabaseAuth(
  async (req: NextApiRequest, res: NextApiResponse<HttpResponse<{ submission: any }>>, session) => {
    try {
      if (!session.user) {
        res.status(401).json({ data: { submission: null }, status: 401 })
        return
      }

      const portalUser = await PortalService.getPortalUser(session.user.id)
      if (!portalUser || portalUser.status !== 'active') {
        res.status(403).json({ data: { submission: null }, status: 403 })
        return
      }

      const { company_info, tools_tech, goals_needs } = req.body

      const submission = await IntakeService.submit(portalUser.org_id, session.user.id, {
        company_info,
        tools_tech,
        goals_needs,
      })

      res.status(200).json({
        data: { submission },
        status: 200,
      })
    } catch (error: unknown) {
      console.error('[submitIntakeController] Error:', error)
      res.status(500).json({
        data: { submission: null },
        status: 500,
      })
    }
  }
)
