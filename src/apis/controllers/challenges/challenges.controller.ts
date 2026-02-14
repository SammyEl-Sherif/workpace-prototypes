import { NextApiRequest, NextApiResponse } from 'next'

import { ChallengesService } from './challenges.service'
import {
  CreateChallengeInput,
  UpdateChallengeInput,
  CreateChallengeInvitationInput,
  UpdateChallengeInvitationInput,
  CreateChallengeEvidenceInput,
} from '@/interfaces/challenges'
import { HttpResponse } from '@/server/types'
import { withSupabaseAuth } from '@/server/utils'

export const getChallengesController = withSupabaseAuth(
  async (
    req: NextApiRequest,
    res: NextApiResponse<HttpResponse<{ challenges: any[] }>>,
    session
  ) => {
    try {
      if (!session.user) {
        res.status(401).json({
          data: { challenges: [] },
          status: 401,
        })
        return
      }
      const userId = session.user.id
      const challenges = await ChallengesService.getAll(userId)

      res.status(200).json({
        data: { challenges },
        status: 200,
      })
    } catch (error: unknown) {
      res.status(500).json({
        data: { challenges: [] },
        status: 500,
      })
    }
  }
)

export const getChallengeByIdController = withSupabaseAuth(
  async (
    req: NextApiRequest,
    res: NextApiResponse<HttpResponse<{ challenge: any | null }>>,
    session
  ) => {
    try {
      if (!session.user) {
        res.status(401).json({
          data: { challenge: null },
          status: 401,
        })
        return
      }
      const { id } = req.query
      const userId = session.user.id

      if (!id || typeof id !== 'string') {
        res.status(400).json({
          data: { challenge: null },
          status: 400,
        })
        return
      }

      const challenge = await ChallengesService.getById(id, userId)

      res.status(200).json({
        data: { challenge },
        status: 200,
      })
    } catch (error: unknown) {
      res.status(500).json({
        data: { challenge: null },
        status: 500,
      })
    }
  }
)

export const createChallengeController = withSupabaseAuth(
  async (req: NextApiRequest, res: NextApiResponse<HttpResponse<{ challenge: any }>>, session) => {
    try {
      if (req.method !== 'POST') {
        res.status(405).json({
          data: { challenge: null as any },
          status: 405,
        })
        return
      }

      if (!session.user) {
        res.status(401).json({
          data: { challenge: null as any },
          status: 401,
        })
        return
      }
      const userId = session.user.id
      const input: CreateChallengeInput = req.body

      const challenge = await ChallengesService.create(userId, input)

      res.status(201).json({
        data: { challenge },
        status: 201,
      })
    } catch (error: unknown) {
      const status = error instanceof Error && error.message.includes('required') ? 400 : 500
      res.status(status).json({
        data: { challenge: null as any },
        status,
      })
    }
  }
)

export const updateChallengeController = withSupabaseAuth(
  async (req: NextApiRequest, res: NextApiResponse<HttpResponse<{ challenge: any }>>, session) => {
    try {
      if (req.method !== 'PUT' && req.method !== 'PATCH') {
        res.status(405).json({
          data: { challenge: null as any },
          status: 405,
        })
        return
      }

      if (!session.user) {
        res.status(401).json({
          data: { challenge: null as any },
          status: 401,
        })
        return
      }
      const { id } = req.query
      const userId = session.user.id

      if (!id || typeof id !== 'string') {
        res.status(400).json({
          data: { challenge: null as any },
          status: 400,
        })
        return
      }

      const input: UpdateChallengeInput = req.body

      const challenge = await ChallengesService.update(id, userId, input)

      res.status(200).json({
        data: { challenge },
        status: 200,
      })
    } catch (error: unknown) {
      const status =
        error instanceof Error && error.message.includes('not found')
          ? 404
          : error instanceof Error && error.message.includes('required')
          ? 400
          : 500
      res.status(status).json({
        data: { challenge: null as any },
        status,
      })
    }
  }
)

export const deleteChallengeController = withSupabaseAuth(
  async (
    req: NextApiRequest,
    res: NextApiResponse<HttpResponse<{ success: boolean }>>,
    session
  ) => {
    try {
      if (req.method !== 'DELETE') {
        res.status(405).json({
          data: { success: false },
          status: 405,
        })
        return
      }

      if (!session.user) {
        res.status(401).json({
          data: { success: false },
          status: 401,
        })
        return
      }
      const { id } = req.query
      const userId = session.user.id

      if (!id || typeof id !== 'string') {
        res.status(400).json({
          data: { success: false },
          status: 400,
        })
        return
      }

      await ChallengesService.delete(id, userId)

      res.status(200).json({
        data: { success: true },
        status: 200,
      })
    } catch (error: unknown) {
      const status = error instanceof Error && error.message.includes('not found') ? 404 : 500
      res.status(status).json({
        data: { success: false },
        status,
      })
    }
  }
)

export const getChallengeParticipantsController = withSupabaseAuth(
  async (
    req: NextApiRequest,
    res: NextApiResponse<HttpResponse<{ participants: any[] }>>,
    session
  ) => {
    try {
      if (!session.user) {
        res.status(401).json({
          data: { participants: [] },
          status: 401,
        })
        return
      }
      const { challenge_id } = req.query

      if (!challenge_id || typeof challenge_id !== 'string') {
        res.status(400).json({
          data: { participants: [] },
          status: 400,
        })
        return
      }

      const participants = await ChallengesService.getParticipants(challenge_id)

      res.status(200).json({
        data: { participants },
        status: 200,
      })
    } catch (error: unknown) {
      res.status(500).json({
        data: { participants: [] },
        status: 500,
      })
    }
  }
)

export const createChallengeInvitationController = withSupabaseAuth(
  async (req: NextApiRequest, res: NextApiResponse<HttpResponse<{ invitation: any }>>, session) => {
    try {
      if (req.method !== 'POST') {
        res.status(405).json({
          data: { invitation: null as any },
          status: 405,
        })
        return
      }

      if (!session.user) {
        res.status(401).json({
          data: { invitation: null as any },
          status: 401,
        })
        return
      }
      const userId = session.user.id
      const input: CreateChallengeInvitationInput = req.body

      const invitation = await ChallengesService.createInvitation(userId, input)

      res.status(201).json({
        data: { invitation },
        status: 201,
      })
    } catch (error: unknown) {
      const status = error instanceof Error && error.message.includes('required') ? 400 : 500
      res.status(status).json({
        data: { invitation: null as any },
        status,
      })
    }
  }
)

export const getChallengeInvitationsController = withSupabaseAuth(
  async (
    req: NextApiRequest,
    res: NextApiResponse<HttpResponse<{ invitations: any[] }>>,
    session
  ) => {
    try {
      if (!session.user) {
        res.status(401).json({
          data: { invitations: [] },
          status: 401,
        })
        return
      }
      const userId = session.user.id
      const invitations = await ChallengesService.getInvitationsForUser(userId)

      res.status(200).json({
        data: { invitations },
        status: 200,
      })
    } catch (error: unknown) {
      res.status(500).json({
        data: { invitations: [] },
        status: 500,
      })
    }
  }
)

export const updateChallengeInvitationController = withSupabaseAuth(
  async (req: NextApiRequest, res: NextApiResponse<HttpResponse<{ invitation: any }>>, session) => {
    try {
      if (req.method !== 'PUT' && req.method !== 'PATCH') {
        res.status(405).json({
          data: { invitation: null as any },
          status: 405,
        })
        return
      }

      if (!session.user) {
        res.status(401).json({
          data: { invitation: null as any },
          status: 401,
        })
        return
      }
      const { id } = req.query
      const userId = session.user.id

      if (!id || typeof id !== 'string') {
        res.status(400).json({
          data: { invitation: null as any },
          status: 400,
        })
        return
      }

      const input: UpdateChallengeInvitationInput = req.body

      const invitation = await ChallengesService.updateInvitationStatus(id, userId, input)

      res.status(200).json({
        data: { invitation },
        status: 200,
      })
    } catch (error: unknown) {
      const status =
        error instanceof Error && error.message.includes('not found')
          ? 404
          : error instanceof Error && error.message.includes('required')
          ? 400
          : 500
      res.status(status).json({
        data: { invitation: null as any },
        status,
      })
    }
  }
)

export const getChallengeEvidenceController = withSupabaseAuth(
  async (req: NextApiRequest, res: NextApiResponse<HttpResponse<{ evidence: any[] }>>, session) => {
    try {
      if (!session.user) {
        res.status(401).json({
          data: { evidence: [] },
          status: 401,
        })
        return
      }
      const { challenge_id, user_id } = req.query
      const userId = session.user.id

      if (!challenge_id || typeof challenge_id !== 'string') {
        res.status(400).json({
          data: { evidence: [] },
          status: 400,
        })
        return
      }

      const evidenceUserId = user_id && typeof user_id === 'string' ? user_id : userId
      const evidence = await ChallengesService.getEvidence(challenge_id, evidenceUserId)

      res.status(200).json({
        data: { evidence },
        status: 200,
      })
    } catch (error: unknown) {
      res.status(500).json({
        data: { evidence: [] },
        status: 500,
      })
    }
  }
)

export const createChallengeEvidenceController = withSupabaseAuth(
  async (req: NextApiRequest, res: NextApiResponse<HttpResponse<{ evidence: any }>>, session) => {
    try {
      if (req.method !== 'POST') {
        res.status(405).json({
          data: { evidence: null as any },
          status: 405,
        })
        return
      }

      if (!session.user) {
        res.status(401).json({
          data: { evidence: null as any },
          status: 401,
        })
        return
      }
      const userId = session.user.id
      const input: CreateChallengeEvidenceInput = req.body

      const evidence = await ChallengesService.createEvidence(userId, input)

      res.status(201).json({
        data: { evidence },
        status: 201,
      })
    } catch (error: unknown) {
      const status = error instanceof Error && error.message.includes('required') ? 400 : 500
      res.status(status).json({
        data: { evidence: null as any },
        status,
      })
    }
  }
)

export const deleteChallengeEvidenceController = withSupabaseAuth(
  async (
    req: NextApiRequest,
    res: NextApiResponse<HttpResponse<{ success: boolean }>>,
    session
  ) => {
    try {
      if (req.method !== 'DELETE') {
        res.status(405).json({
          data: { success: false },
          status: 405,
        })
        return
      }

      if (!session.user) {
        res.status(401).json({
          data: { success: false },
          status: 401,
        })
        return
      }
      const { id } = req.query
      const userId = session.user.id

      if (!id || typeof id !== 'string') {
        res.status(400).json({
          data: { success: false },
          status: 400,
        })
        return
      }

      await ChallengesService.deleteEvidence(id, userId)

      res.status(200).json({
        data: { success: true },
        status: 200,
      })
    } catch (error: unknown) {
      const status = error instanceof Error && error.message.includes('not found') ? 404 : 500
      res.status(status).json({
        data: { success: false },
        status,
      })
    }
  }
)
