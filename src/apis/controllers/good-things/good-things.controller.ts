import { NextApiRequest, NextApiResponse } from 'next'

import { GoodThingsService } from './good-things.service'
import {
  CreateGoodThingInput,
  UpdateGoodThingInput,
} from '@/interfaces/good-things'
import { HttpResponse } from '@/server/types'
import { withSupabaseAuth } from '@/server/utils'

export const getGoodThingsController = withSupabaseAuth(
  async (
    req: NextApiRequest,
    res: NextApiResponse<HttpResponse<{ good_things: any[] }>>,
    session
  ) => {
    try {
      const userId = session.user.id
      const goodThings = await GoodThingsService.getAll(userId)

      res.status(200).json({
        data: { good_things: goodThings },
        status: 200,
      })
    } catch (error: any) {
      res.status(500).json({
        data: { good_things: [] },
        status: 500,
        error: error.message || 'Failed to fetch good things',
      })
    }
  }
)

export const getGoodThingByIdController = withSupabaseAuth(
  async (
    req: NextApiRequest,
    res: NextApiResponse<HttpResponse<{ good_thing: any | null }>>,
    session
  ) => {
    try {
      const { id } = req.query
      const userId = session.user.id

      if (!id || typeof id !== 'string') {
        res.status(400).json({
          data: { good_thing: null },
          status: 400,
          error: 'Good thing ID is required',
        })
        return
      }

      const goodThing = await GoodThingsService.getById(id, userId)

      res.status(200).json({
        data: { good_thing: goodThing },
        status: 200,
      })
    } catch (error: any) {
      res.status(500).json({
        data: { good_thing: null },
        status: 500,
        error: error.message || 'Failed to fetch good thing',
      })
    }
  }
)

export const createGoodThingController = withSupabaseAuth(
  async (
    req: NextApiRequest,
    res: NextApiResponse<HttpResponse<{ good_thing: any }>>,
    session
  ) => {
    try {
      if (req.method !== 'POST') {
        res.status(405).json({
          data: { good_thing: null as any },
          status: 405,
          error: 'Method not allowed',
        })
        return
      }

      const userId = session.user.id
      const input: CreateGoodThingInput = req.body

      const goodThing = await GoodThingsService.create(userId, input)

      res.status(201).json({
        data: { good_thing: goodThing },
        status: 201,
      })
    } catch (error: any) {
      const status = error.message.includes('required') ? 400 : 500
      res.status(status).json({
        data: { good_thing: null as any },
        status,
        error: error.message || 'Failed to create good thing',
      })
    }
  }
)

export const updateGoodThingController = withSupabaseAuth(
  async (
    req: NextApiRequest,
    res: NextApiResponse<HttpResponse<{ good_thing: any }>>,
    session
  ) => {
    try {
      if (req.method !== 'PUT' && req.method !== 'PATCH') {
        res.status(405).json({
          data: { good_thing: null as any },
          status: 405,
          error: 'Method not allowed',
        })
        return
      }

      const { id } = req.query
      const userId = session.user.id

      if (!id || typeof id !== 'string') {
        res.status(400).json({
          data: { good_thing: null as any },
          status: 400,
          error: 'Good thing ID is required',
        })
        return
      }

      const input: UpdateGoodThingInput = req.body

      const goodThing = await GoodThingsService.update(id, userId, input)

      res.status(200).json({
        data: { good_thing: goodThing },
        status: 200,
      })
    } catch (error: any) {
      const status = error.message.includes('not found') ? 404 : error.message.includes('required') ? 400 : 500
      res.status(status).json({
        data: { good_thing: null as any },
        status,
        error: error.message || 'Failed to update good thing',
      })
    }
  }
)

export const deleteGoodThingController = withSupabaseAuth(
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
          error: 'Good thing ID is required',
        })
        return
      }

      await GoodThingsService.delete(id, userId)

      res.status(200).json({
        data: { success: true },
        status: 200,
      })
    } catch (error: any) {
      const status = error.message.includes('not found') ? 404 : 500
      res.status(status).json({
        data: { success: false },
        status,
        error: error.message || 'Failed to delete good thing',
      })
    }
  }
)
