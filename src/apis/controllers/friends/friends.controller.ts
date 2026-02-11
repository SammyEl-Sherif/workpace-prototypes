import { NextApiRequest, NextApiResponse } from 'next'

import { FriendsService } from './friends.service'
import { CreateFriendInput } from './friends.types'
import { HttpResponse } from '@/server/types'
import { withSupabaseAuth } from '@/server/utils'

export const getFriendsController = withSupabaseAuth(
  async (req: NextApiRequest, res: NextApiResponse<HttpResponse<{ friends: any[] }>>, session) => {
    try {
      if (!session.user) {
        res.status(401).json({
          data: { friends: [] },
          status: 401,
        })
        return
      }

      const userId = session.user.id
      const friends = await FriendsService.getAll(userId)

      res.status(200).json({
        data: { friends },
        status: 200,
      })
    } catch (error: unknown) {
      console.error('[getFriendsController] Error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'

      // Check if it's a table doesn't exist error
      if (
        errorMessage.includes('does not exist') ||
        errorMessage.includes('relation') ||
        errorMessage.includes('table')
      ) {
        console.error('[getFriendsController] Database table may not exist. Please run migrations.')
      }

      res.status(500).json({
        data: { friends: [] },
        status: 500,
      })
    }
  }
)

export const createFriendController = withSupabaseAuth(
  async (req: NextApiRequest, res: NextApiResponse<HttpResponse<{ friend: any }>>, session) => {
    try {
      if (req.method !== 'POST') {
        res.status(405).json({
          data: { friend: null as any },
          status: 405,
        })
        return
      }

      if (!session.user) {
        res.status(401).json({
          data: { friend: null as any },
          status: 401,
        })
        return
      }

      const userId = session.user.id
      const input: CreateFriendInput = req.body

      if (!input.friend_id) {
        res.status(400).json({
          data: { friend: null as any },
          status: 400,
        })
        return
      }

      const friend = await FriendsService.create(userId, input)

      res.status(201).json({
        data: { friend },
        status: 201,
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      const status =
        errorMessage.includes('already added') || errorMessage.includes('yourself')
          ? 400
          : errorMessage.includes('required')
          ? 400
          : 500

      res.status(status).json({
        data: { friend: null as any },
        status,
      })
    }
  }
)

export const deleteFriendController = withSupabaseAuth(
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

      await FriendsService.delete(userId, id)

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

export const searchUsersController = withSupabaseAuth(
  async (req: NextApiRequest, res: NextApiResponse<HttpResponse<{ users: any[] }>>, session) => {
    try {
      if (!session.user) {
        res.status(401).json({
          data: { users: [] },
          status: 401,
        })
        return
      }

      const { q } = req.query
      const userId = session.user.id

      if (!q || typeof q !== 'string' || q.trim() === '') {
        res.status(400).json({
          data: { users: [] },
          status: 400,
        })
        return
      }

      const users = await FriendsService.searchUsers(q.trim(), userId)

      res.status(200).json({
        data: { users },
        status: 200,
      })
    } catch (error: unknown) {
      console.error('[searchUsersController] Error:', error)
      res.status(500).json({
        data: { users: [] },
        status: 500,
      })
    }
  }
)
