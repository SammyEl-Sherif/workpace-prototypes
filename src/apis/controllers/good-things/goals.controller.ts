import { NextApiRequest, NextApiResponse } from 'next'

import { GoalsService } from './goals.service'
import { CreateGoalInput, UpdateGoalInput } from '@/interfaces/good-things'
import { HttpResponse } from '@/server/types'
import { withSupabaseAuth } from '@/server/utils'

export const getGoalsController = withSupabaseAuth(
  async (
    req: NextApiRequest,
    res: NextApiResponse<HttpResponse<{ goals: any[] }>>,
    session
  ) => {
    try {
      const userId = session.user.id
      const goals = await GoalsService.getAll(userId)

      res.status(200).json({
        data: { goals },
        status: 200,
      })
    } catch (error: any) {
      res.status(500).json({
        data: { goals: [] },
        status: 500,
        error: error.message || 'Failed to fetch goals',
      })
    }
  }
)

export const getGoalByIdController = withSupabaseAuth(
  async (
    req: NextApiRequest,
    res: NextApiResponse<HttpResponse<{ goal: any | null }>>,
    session
  ) => {
    try {
      const { id } = req.query
      const userId = session.user.id

      if (!id || typeof id !== 'string') {
        res.status(400).json({
          data: { goal: null },
          status: 400,
          error: 'Goal ID is required',
        })
        return
      }

      const goal = await GoalsService.getById(id, userId)

      res.status(200).json({
        data: { goal },
        status: 200,
      })
    } catch (error: any) {
      res.status(500).json({
        data: { goal: null },
        status: 500,
        error: error.message || 'Failed to fetch goal',
      })
    }
  }
)

export const createGoalController = withSupabaseAuth(
  async (
    req: NextApiRequest,
    res: NextApiResponse<HttpResponse<{ goal: any }>>,
    session
  ) => {
    try {
      if (req.method !== 'POST') {
        res.status(405).json({
          data: { goal: null as any },
          status: 405,
          error: 'Method not allowed',
        })
        return
      }

      const userId = session.user.id
      const input: CreateGoalInput = req.body

      const goal = await GoalsService.create(userId, input)

      res.status(201).json({
        data: { goal },
        status: 201,
      })
    } catch (error: any) {
      const status = error.message.includes('required') ? 400 : 500
      res.status(status).json({
        data: { goal: null as any },
        status,
        error: error.message || 'Failed to create goal',
      })
    }
  }
)

export const updateGoalController = withSupabaseAuth(
  async (
    req: NextApiRequest,
    res: NextApiResponse<HttpResponse<{ goal: any }>>,
    session
  ) => {
    try {
      if (req.method !== 'PUT' && req.method !== 'PATCH') {
        res.status(405).json({
          data: { goal: null as any },
          status: 405,
          error: 'Method not allowed',
        })
        return
      }

      const { id } = req.query
      const userId = session.user.id

      if (!id || typeof id !== 'string') {
        res.status(400).json({
          data: { goal: null as any },
          status: 400,
          error: 'Goal ID is required',
        })
        return
      }

      const input: UpdateGoalInput = req.body

      const goal = await GoalsService.update(id, userId, input)

      res.status(200).json({
        data: { goal },
        status: 200,
      })
    } catch (error: any) {
      const status = error.message.includes('not found') ? 404 : error.message.includes('required') ? 400 : 500
      res.status(status).json({
        data: { goal: null as any },
        status,
        error: error.message || 'Failed to update goal',
      })
    }
  }
)

export const deleteGoalController = withSupabaseAuth(
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
          error: 'Method not allowed',
        })
        return
      }

      const { id } = req.query
      const userId = session.user.id

      if (!id || typeof id !== 'string') {
        res.status(400).json({
          data: { success: false },
          status: 400,
          error: 'Goal ID is required',
        })
        return
      }

      await GoalsService.delete(id, userId)

      res.status(200).json({
        data: { success: true },
        status: 200,
      })
    } catch (error: any) {
      const status = error.message.includes('not found') ? 404 : 500
      res.status(status).json({
        data: { success: false },
        status,
        error: error.message || 'Failed to delete goal',
      })
    }
  }
)
