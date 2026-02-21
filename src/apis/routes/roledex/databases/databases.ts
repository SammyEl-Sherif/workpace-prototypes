import { NextApiRequest, NextApiResponse } from 'next'

import { createSupabaseServerClient } from '@/server/utils/supabase/createSupabaseClient'
import { getSupabaseSession } from '@/server/utils/supabase/getSupabaseSession'
import { requireApiAuth } from '@/server/utils'
import { HttpResponse } from '@/server/types'

interface RoledexDatabase {
  id: string
  user_id: string
  database_id: string
  database_title: string | null
  created_at: string
  updated_at: string
}

export const getRoledexDatabasesRoute = requireApiAuth(
  async (req: NextApiRequest, res: NextApiResponse<HttpResponse<RoledexDatabase[]>>) => {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET')
      res.status(405).json({ data: [], status: 405 })
      return
    }

    try {
      const session = await getSupabaseSession(req)
      if (!session?.user) {
        res.status(401).json({ data: [], status: 401 })
        return
      }

      const supabase = createSupabaseServerClient()
      const { data, error } = await supabase
        .from('roledex_databases')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('[Roledex] Error fetching databases:', error)
        res.status(500).json({ data: [], status: 500 })
        return
      }

      res.status(200).json({ data: data || [], status: 200 })
    } catch (error: unknown) {
      console.error('[Roledex] Error:', error)
      res.status(500).json({ data: [], status: 500 })
    }
  }
)

export const addRoledexDatabaseRoute = requireApiAuth(
  async (req: NextApiRequest, res: NextApiResponse<HttpResponse<RoledexDatabase>>) => {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST')
      res.status(405).json({ data: {} as RoledexDatabase, status: 405 })
      return
    }

    try {
      const session = await getSupabaseSession(req)
      if (!session?.user) {
        res.status(401).json({ data: {} as RoledexDatabase, status: 401 })
        return
      }

      const { database_id, database_title } = req.body as {
        database_id?: string
        database_title?: string
      }

      if (!database_id || typeof database_id !== 'string') {
        res.status(400).json({
          data: {} as RoledexDatabase,
          status: 400,
        })
        return
      }

      const supabase = createSupabaseServerClient()
      const { data, error } = await supabase
        .from('roledex_databases')
        .insert({
          user_id: session.user.id,
          database_id: database_id.trim(),
          database_title: database_title || null,
        })
        .select()
        .single()

      if (error) {
        if (error.code === '23505') {
          res.status(409).json({
            data: {} as RoledexDatabase,
            status: 409,
          })
          return
        }
        console.error('[Roledex] Error adding database:', error)
        res.status(500).json({
          data: {} as RoledexDatabase,
          status: 500,
        })
        return
      }

      res.status(201).json({ data: data, status: 201 })
    } catch (error: unknown) {
      console.error('[Roledex] Error:', error)
      res.status(500).json({ data: {} as RoledexDatabase, status: 500 })
    }
  }
)

export const removeRoledexDatabaseRoute = requireApiAuth(
  async (req: NextApiRequest, res: NextApiResponse<HttpResponse<void>>) => {
    if (req.method !== 'DELETE') {
      res.setHeader('Allow', 'DELETE')
      res.status(405).json({ data: undefined, status: 405 })
      return
    }

    try {
      const session = await getSupabaseSession(req)
      if (!session?.user) {
        res.status(401).json({ data: undefined, status: 401 })
        return
      }

      const { id } = req.body as { id?: string }

      if (!id || typeof id !== 'string') {
        res.status(400).json({ data: undefined, status: 400 })
        return
      }

      const supabase = createSupabaseServerClient()
      const { error } = await supabase
        .from('roledex_databases')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id)

      if (error) {
        console.error('[Roledex] Error removing database:', error)
        res.status(500).json({ data: undefined, status: 500 })
        return
      }

      res.status(200).json({ data: undefined, status: 200 })
    } catch (error: unknown) {
      console.error('[Roledex] Error:', error)
      res.status(500).json({ data: undefined, status: 500 })
    }
  }
)
