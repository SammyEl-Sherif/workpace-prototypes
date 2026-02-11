import { NextApiRequest, NextApiResponse } from 'next'

import { GoodThingsService } from './good-things.service'
import { CreateGoodThingInput, UpdateGoodThingInput } from '@/interfaces/good-things'
import { HttpResponse } from '@/server/types'
import { withSupabaseAuth } from '@/server/utils'

export const getGoodThingsController = withSupabaseAuth(
  async (
    req: NextApiRequest,
    res: NextApiResponse<HttpResponse<{ good_things: any[] }>>,
    session
  ) => {
    try {
      if (!session.user) {
        res.status(401).json({
          data: { good_things: [] },
          status: 401,
        })
        return
      }
      const userId = session.user.id
      const goodThings = await GoodThingsService.getAll(userId)

      res.status(200).json({
        data: { good_things: goodThings },
        status: 200,
      })
    } catch (error: unknown) {
      res.status(500).json({
        data: { good_things: [] },
        status: 500,
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
      if (!session.user) {
        res.status(401).json({
          data: { good_thing: null },
          status: 401,
        })
        return
      }
      const { id } = req.query
      const userId = session.user.id

      if (!id || typeof id !== 'string') {
        res.status(400).json({
          data: { good_thing: null },
          status: 400,
        })
        return
      }

      const goodThing = await GoodThingsService.getById(id, userId)

      res.status(200).json({
        data: { good_thing: goodThing },
        status: 200,
      })
    } catch (error: unknown) {
      res.status(500).json({
        data: { good_thing: null },
        status: 500,
      })
    }
  }
)

export const createGoodThingController = withSupabaseAuth(
  async (req: NextApiRequest, res: NextApiResponse<HttpResponse<{ good_thing: any }>>, session) => {
    try {
      if (req.method !== 'POST') {
        res.status(405).json({
          data: { good_thing: null as any },
          status: 405,
        })
        return
      }

      if (!session.user) {
        res.status(401).json({
          data: { good_thing: null as any },
          status: 401,
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
    } catch (error: unknown) {
      const status = error instanceof Error && error.message.includes('required') ? 400 : 500
      res.status(status).json({
        data: { good_thing: null as any },
        status,
      })
    }
  }
)

export const updateGoodThingController = withSupabaseAuth(
  async (req: NextApiRequest, res: NextApiResponse<HttpResponse<{ good_thing: any }>>, session) => {
    try {
      if (req.method !== 'PUT' && req.method !== 'PATCH') {
        res.status(405).json({
          data: { good_thing: null as any },
          status: 405,
        })
        return
      }

      if (!session.user) {
        res.status(401).json({
          data: { good_thing: null as any },
          status: 401,
        })
        return
      }
      const { id } = req.query
      const userId = session.user.id

      if (!id || typeof id !== 'string') {
        res.status(400).json({
          data: { good_thing: null as any },
          status: 400,
        })
        return
      }

      const input: UpdateGoodThingInput = req.body

      const goodThing = await GoodThingsService.update(id, userId, input)

      res.status(200).json({
        data: { good_thing: goodThing },
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
        data: { good_thing: null as any },
        status,
      })
    }
  }
)

export const getGoodThingsByDateRangeController = withSupabaseAuth(
  async (
    req: NextApiRequest,
    res: NextApiResponse<HttpResponse<{ good_things: any[] }>>,
    session
  ) => {
    try {
      if (!session.user) {
        res.status(401).json({ data: { good_things: [] }, status: 401 })
        return
      }

      const { start_date, end_date } = req.query
      if (
        !start_date ||
        !end_date ||
        typeof start_date !== 'string' ||
        typeof end_date !== 'string'
      ) {
        res.status(400).json({ data: { good_things: [] }, status: 400 })
        return
      }

      const goodThings = await GoodThingsService.getByDateRange(
        session.user.id,
        start_date,
        end_date
      )

      res.status(200).json({
        data: { good_things: goodThings },
        status: 200,
      })
    } catch (error: unknown) {
      res.status(500).json({ data: { good_things: [] }, status: 500 })
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

      await GoodThingsService.delete(id, userId)

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

export const bulkCreateGoodThingsController = withSupabaseAuth(
  async (
    req: NextApiRequest,
    res: NextApiResponse<HttpResponse<{ good_things: any[] }>>,
    session
  ) => {
    try {
      if (req.method !== 'POST') {
        res.status(405).json({
          data: { good_things: [] },
          status: 405,
        })
        return
      }

      if (!session.user) {
        res.status(401).json({
          data: { good_things: [] },
          status: 401,
        })
        return
      }

      const userId = session.user.id

      // Handle both direct array and wrapped in data property
      let inputs: CreateGoodThingInput[]
      if (Array.isArray(req.body)) {
        inputs = req.body
      } else if (req.body && Array.isArray(req.body.data)) {
        inputs = req.body.data
      } else {
        console.error('[Bulk Create] Invalid request body format:', {
          body: req.body,
          bodyType: typeof req.body,
          isArray: Array.isArray(req.body),
        })
        res.status(400).json({
          data: { good_things: [] },
          status: 400,
        })
        return
      }

      if (inputs.length === 0) {
        res.status(400).json({
          data: { good_things: [] },
          status: 400,
        })
        return
      }

      console.log('[Bulk Create] Creating', inputs.length, 'good things for user', userId)

      const goodThings = await GoodThingsService.bulkCreate(userId, inputs)

      res.status(201).json({
        data: { good_things: goodThings },
        status: 201,
      })
    } catch (error: unknown) {
      console.error('Bulk create error:', error)
      res.status(500).json({
        data: { good_things: [] },
        status: 500,
      })
    }
  }
)
