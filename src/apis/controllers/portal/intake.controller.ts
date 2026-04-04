import { NextApiRequest, NextApiResponse } from 'next'

import { HttpResponse } from '@/server/types'
import { withSupabaseAuth } from '@/server/utils'
import { UserGroup } from '@/interfaces/user'
import { querySupabase } from '@/db'

import { resumeThread } from '@/langgraph/utils/thread-lookup'

import { PortalService } from './portal.service'
import { IntakeService } from './intake.service'
import { ContractsService } from './contracts.service'

const isAdminUser = async (userId: string): Promise<boolean> => {
  const roles = await querySupabase<{ role: string }>('users/get_user_roles.sql', [userId])
  return roles.some((r) => r.role === UserGroup.Admin)
}

export const getPendingSubmissionController = withSupabaseAuth(
  async (req: NextApiRequest, res: NextApiResponse<HttpResponse<{ submission: any }>>, session) => {
    try {
      if (!session.user) {
        res.status(401).json({ data: { submission: null }, status: 401 })
        return
      }

      const portalUser = await PortalService.getPortalUser(session.user.id)
      if (!portalUser || portalUser.status !== 'pending_approval') {
        res.status(403).json({ data: { submission: null }, status: 403 })
        return
      }

      const submission = await IntakeService.getByOrgId(portalUser.org_id)

      res.status(200).json({
        data: { submission },
        status: 200,
      })
    } catch (error: unknown) {
      console.error('[getPendingSubmissionController] Error:', error)
      res.status(500).json({
        data: { submission: null },
        status: 500,
      })
    }
  }
)

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

      // Resume the LangGraph pipeline if a thread exists for this org
      try {
        await resumeThread({ orgId: portalUser.org_id }, { action: 'intake_submitted' })
      } catch (error) {
        console.warn('[Intake Submit] No pipeline thread for org:', portalUser.org_id)
      }

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

export const getAllIntakesController = withSupabaseAuth(
  async (
    req: NextApiRequest,
    res: NextApiResponse<HttpResponse<{ submissions: any[] }>>,
    session
  ) => {
    try {
      if (!session.user) {
        res.status(401).json({ data: { submissions: [] }, status: 401 })
        return
      }

      const adminCheck = await isAdminUser(session.user.id)
      if (!adminCheck) {
        res.status(403).json({ data: { submissions: [] }, status: 403 })
        return
      }

      const submissions = await IntakeService.getAllWithOrg()

      res.status(200).json({
        data: { submissions },
        status: 200,
      })
    } catch (error: unknown) {
      console.error('[getAllIntakesController] Error:', error)
      res.status(500).json({
        data: { submissions: [] },
        status: 500,
      })
    }
  }
)

export const reviewIntakeController = withSupabaseAuth(
  async (req: NextApiRequest, res: NextApiResponse<HttpResponse<{ submission: any }>>, session) => {
    try {
      if (!session.user) {
        res.status(401).json({ data: { submission: null }, status: 401 })
        return
      }

      const adminCheck = await isAdminUser(session.user.id)
      if (!adminCheck) {
        res.status(403).json({ data: { submission: null }, status: 403 })
        return
      }

      const { id } = req.query
      if (!id || typeof id !== 'string') {
        res.status(400).json({ data: { submission: null }, status: 400 })
        return
      }

      const submission = await IntakeService.markReviewed(id)
      if (!submission) {
        res.status(404).json({ data: { submission: null }, status: 404 })
        return
      }

      res.status(200).json({
        data: { submission },
        status: 200,
      })
    } catch (error: unknown) {
      console.error('[reviewIntakeController] Error:', error)
      res.status(500).json({
        data: { submission: null },
        status: 500,
      })
    }
  }
)

export const sendContractForIntakeController = withSupabaseAuth(
  async (req: NextApiRequest, res: NextApiResponse<HttpResponse<{ contract: any }>>, session) => {
    try {
      if (!session.user) {
        res.status(401).json({ data: { contract: null }, status: 401 })
        return
      }

      const adminCheck = await isAdminUser(session.user.id)
      if (!adminCheck) {
        res.status(403).json({ data: { contract: null }, status: 403 })
        return
      }

      const { id } = req.query
      if (!id || typeof id !== 'string') {
        res.status(400).json({ data: { contract: null }, status: 400 })
        return
      }

      const { title, signing_method, template_id, document_url, signer_email, signer_name } =
        req.body

      if (!title || !signing_method || !signer_email || !signer_name) {
        res.status(400).json({ data: { contract: null }, status: 400 })
        return
      }

      if (!template_id && !document_url) {
        res.status(400).json({ data: { contract: null }, status: 400 })
        return
      }

      // Look up intake to get org_id
      const submissions = await IntakeService.getAllWithOrg()
      const intake = submissions.find((s) => s.id === id)
      if (!intake) {
        res.status(404).json({ data: { contract: null }, status: 404 })
        return
      }

      // Create the contract
      const contract = await ContractsService.create(intake.org_id, session.user.id, {
        title,
        signing_method,
        template_id,
        document_url,
        signer_email,
        signer_name,
      })

      // Send the contract via DocuSign
      const sentContract = await ContractsService.createAndSendEnvelope(intake.org_id, contract.id)

      // Mark intake as reviewed
      await IntakeService.markReviewed(id)

      res.status(201).json({
        data: { contract: sentContract },
        status: 201,
      })
    } catch (error: unknown) {
      console.error('[sendContractForIntakeController] Error:', error)
      res.status(500).json({
        data: { contract: null },
        status: 500,
      })
    }
  }
)
