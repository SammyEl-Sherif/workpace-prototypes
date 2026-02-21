import { NextApiRequest, NextApiResponse } from 'next'

import { HttpResponse } from '@/server/types'
import { withSupabaseAuth } from '@/server/utils'

import { PortalService } from './portal.service'
import { ContractsService } from './contracts.service'

export const getContractsController = withSupabaseAuth(
  async (
    req: NextApiRequest,
    res: NextApiResponse<HttpResponse<{ contracts: any[] }>>,
    session
  ) => {
    try {
      if (!session.user) {
        res.status(401).json({ data: { contracts: [] }, status: 401 })
        return
      }

      const portalUser = await PortalService.getPortalUser(session.user.id)
      if (!portalUser || portalUser.status !== 'active') {
        res.status(403).json({ data: { contracts: [] }, status: 403 })
        return
      }

      const contracts = await ContractsService.getByOrgId(portalUser.org_id)

      res.status(200).json({
        data: { contracts },
        status: 200,
      })
    } catch (error: unknown) {
      console.error('[getContractsController] Error:', error)
      res.status(500).json({
        data: { contracts: [] },
        status: 500,
      })
    }
  }
)

export const getContractController = withSupabaseAuth(
  async (req: NextApiRequest, res: NextApiResponse<HttpResponse<{ contract: any }>>, session) => {
    try {
      if (!session.user) {
        res.status(401).json({ data: { contract: null }, status: 401 })
        return
      }

      const portalUser = await PortalService.getPortalUser(session.user.id)
      if (!portalUser || portalUser.status !== 'active') {
        res.status(403).json({ data: { contract: null }, status: 403 })
        return
      }

      const { id } = req.query
      if (!id || typeof id !== 'string') {
        res.status(400).json({ data: { contract: null }, status: 400 })
        return
      }

      const contract = await ContractsService.getById(id)
      if (!contract || contract.org_id !== portalUser.org_id) {
        res.status(404).json({ data: { contract: null }, status: 404 })
        return
      }

      res.status(200).json({
        data: { contract },
        status: 200,
      })
    } catch (error: unknown) {
      console.error('[getContractController] Error:', error)
      res.status(500).json({
        data: { contract: null },
        status: 500,
      })
    }
  }
)

export const createContractController = withSupabaseAuth(
  async (req: NextApiRequest, res: NextApiResponse<HttpResponse<{ contract: any }>>, session) => {
    try {
      if (!session.user) {
        res.status(401).json({ data: { contract: null }, status: 401 })
        return
      }

      const portalUser = await PortalService.getPortalUser(session.user.id)
      if (!portalUser || portalUser.status !== 'active' || portalUser.role !== 'admin') {
        res.status(403).json({ data: { contract: null }, status: 403 })
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

      const contract = await ContractsService.create(portalUser.org_id, session.user.id, {
        title,
        signing_method,
        template_id,
        document_url,
        signer_email,
        signer_name,
      })

      res.status(201).json({
        data: { contract },
        status: 201,
      })
    } catch (error: unknown) {
      console.error('[createContractController] Error:', error)
      res.status(500).json({
        data: { contract: null },
        status: 500,
      })
    }
  }
)

export const sendContractController = withSupabaseAuth(
  async (req: NextApiRequest, res: NextApiResponse<HttpResponse<{ contract: any }>>, session) => {
    try {
      if (!session.user) {
        res.status(401).json({ data: { contract: null }, status: 401 })
        return
      }

      const portalUser = await PortalService.getPortalUser(session.user.id)
      if (!portalUser || portalUser.status !== 'active' || portalUser.role !== 'admin') {
        res.status(403).json({ data: { contract: null }, status: 403 })
        return
      }

      const { id } = req.query
      if (!id || typeof id !== 'string') {
        res.status(400).json({ data: { contract: null }, status: 400 })
        return
      }

      // Verify contract belongs to this org
      const existing = await ContractsService.getById(id)
      if (!existing || existing.org_id !== portalUser.org_id) {
        res.status(404).json({ data: { contract: null }, status: 404 })
        return
      }

      const contract = await ContractsService.createAndSendEnvelope(portalUser.org_id, id)

      res.status(200).json({
        data: { contract },
        status: 200,
      })
    } catch (error: unknown) {
      console.error('[sendContractController] Error:', error)
      res.status(500).json({
        data: { contract: null },
        status: 500,
      })
    }
  }
)

export const getSigningUrlController = withSupabaseAuth(
  async (
    req: NextApiRequest,
    res: NextApiResponse<HttpResponse<{ signing_url: string | null }>>,
    session
  ) => {
    try {
      if (!session.user) {
        res.status(401).json({ data: { signing_url: null }, status: 401 })
        return
      }

      const portalUser = await PortalService.getPortalUser(session.user.id)
      if (!portalUser || portalUser.status !== 'active') {
        res.status(403).json({ data: { signing_url: null }, status: 403 })
        return
      }

      const { id } = req.query
      if (!id || typeof id !== 'string') {
        res.status(400).json({ data: { signing_url: null }, status: 400 })
        return
      }

      // Verify contract belongs to this org
      const contract = await ContractsService.getById(id)
      if (!contract || contract.org_id !== portalUser.org_id) {
        res.status(404).json({ data: { signing_url: null }, status: 404 })
        return
      }

      const returnUrl = `${
        process.env.NEXTAUTH_URL || 'http://localhost:3000'
      }/portal/contracts?event=signing_complete`
      const signingUrl = await ContractsService.getSigningUrl(portalUser.org_id, id, returnUrl)

      res.status(200).json({
        data: { signing_url: signingUrl },
        status: 200,
      })
    } catch (error: unknown) {
      console.error('[getSigningUrlController] Error:', error)
      res.status(500).json({
        data: { signing_url: null },
        status: 500,
      })
    }
  }
)
