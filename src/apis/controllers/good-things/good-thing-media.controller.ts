import { NextApiRequest, NextApiResponse } from 'next'

import { GoodThingMediaService } from './good-thing-media.service'
import { HttpResponse } from '@/server/types'
import { withSupabaseAuth } from '@/server/utils'

export const getMediaByGoodThingController = withSupabaseAuth(
  async (req: NextApiRequest, res: NextApiResponse<HttpResponse<{ media: any[] }>>, session) => {
    try {
      if (!session.user) {
        res.status(401).json({ data: { media: [] }, status: 401 })
        return
      }

      const { goodThingId } = req.query
      if (!goodThingId || typeof goodThingId !== 'string') {
        res.status(400).json({ data: { media: [] }, status: 400 })
        return
      }

      const media = await GoodThingMediaService.getByGoodThingId(goodThingId, session.user.id)
      res.status(200).json({ data: { media }, status: 200 })
    } catch (error: unknown) {
      res.status(500).json({ data: { media: [] }, status: 500 })
    }
  }
)

export const createMediaController = withSupabaseAuth(
  async (req: NextApiRequest, res: NextApiResponse<HttpResponse<{ media: any }>>, session) => {
    try {
      if (req.method !== 'POST') {
        res.status(405).json({ data: { media: null as any }, status: 405 })
        return
      }

      if (!session.user) {
        res.status(401).json({ data: { media: null as any }, status: 401 })
        return
      }

      const {
        good_thing_id,
        file_name,
        storage_path,
        media_type,
        media_url,
        thumbnail_url,
        file_size_bytes,
        mime_type,
      } = req.body

      if (!good_thing_id || !file_name || !storage_path || !media_type || !media_url) {
        res.status(400).json({ data: { media: null as any }, status: 400 })
        return
      }

      const media = await GoodThingMediaService.create(good_thing_id, session.user.id, {
        file_name,
        storage_path,
        media_type,
        media_url,
        thumbnail_url: thumbnail_url || null,
        file_size_bytes: file_size_bytes || null,
        mime_type: mime_type || null,
      })

      res.status(201).json({ data: { media }, status: 201 })
    } catch (error: unknown) {
      res.status(500).json({ data: { media: null as any }, status: 500 })
    }
  }
)

export const deleteMediaController = withSupabaseAuth(
  async (
    req: NextApiRequest,
    res: NextApiResponse<HttpResponse<{ success: boolean }>>,
    session
  ) => {
    try {
      if (req.method !== 'DELETE') {
        res.status(405).json({ data: { success: false }, status: 405 })
        return
      }

      if (!session.user) {
        res.status(401).json({ data: { success: false }, status: 401 })
        return
      }

      const { id } = req.query
      if (!id || typeof id !== 'string') {
        res.status(400).json({ data: { success: false }, status: 400 })
        return
      }

      await GoodThingMediaService.delete(id, session.user.id)
      res.status(200).json({ data: { success: true }, status: 200 })
    } catch (error: unknown) {
      res.status(500).json({ data: { success: false }, status: 500 })
    }
  }
)
