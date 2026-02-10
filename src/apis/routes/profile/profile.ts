import { NextApiRequest, NextApiResponse } from 'next'

import { withSupabaseAuth } from '@/server/utils/withSupabaseAuth'
import { createClient } from '@supabase/supabase-js'

/**
 * GET /api/profile
 * Get the current user's profile
 */
export const getProfileRoute = withSupabaseAuth(
  async (request: NextApiRequest, response: NextApiResponse, session): Promise<void> => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_WORKPACE_SUPABASE_URL
      const supabaseServiceRoleKey = process.env.WORKPACE_SUPABASE_SERVICE_ROLE_KEY?.trim()

      if (!supabaseUrl || !supabaseServiceRoleKey) {
        response.status(500).json({ error: 'Server configuration error' })
        return
      }

      const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

      // Get user from auth.users
      if (!session.user) {
        response.status(401).json({ error: 'User not found in session' })
        return
      }

      const { data: user, error } = await supabase.auth.admin.getUserById(session.user.id)

      if (error || !user) {
        response.status(404).json({ error: 'User not found' })
        return
      }

      response.status(200).json({
        id: user.user.id,
        email: user.user.email,
        name: user.user.user_metadata?.name || user.user.email,
        given_name: user.user.user_metadata?.given_name || null,
        family_name: user.user.user_metadata?.family_name || null,
        email_verified: user.user.email_confirmed_at !== null,
      })
    } catch (error) {
      console.error('[getProfileRoute] Error:', error)
      response.status(500).json({ error: 'Internal server error' })
    }
  }
)

/**
 * PATCH /api/profile
 * Update the current user's profile
 */
export const updateProfileRoute = withSupabaseAuth(
  async (request: NextApiRequest, response: NextApiResponse, session): Promise<void> => {
    try {
      const { name, email, given_name, family_name } = request.body

      if (!name || !email) {
        response.status(400).json({ error: 'Name and email are required' })
        return
      }

      const supabaseUrl = process.env.NEXT_PUBLIC_WORKPACE_SUPABASE_URL
      const supabaseServiceRoleKey = process.env.WORKPACE_SUPABASE_SERVICE_ROLE_KEY?.trim()

      if (!supabaseUrl || !supabaseServiceRoleKey) {
        response.status(500).json({ error: 'Server configuration error' })
        return
      }

      const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

      // Update user metadata
      if (!session.user) {
        response.status(401).json({ error: 'User not found in session' })
        return
      }

      const { data: user, error } = await supabase.auth.admin.updateUserById(session.user.id, {
        email: email,
        user_metadata: {
          name: name,
          given_name: given_name || null,
          family_name: family_name || null,
          ...session.user.user_metadata,
        },
      })

      if (error || !user) {
        console.error('[updateProfileRoute] Error updating user:', error)
        response.status(500).json({ error: error?.message || 'Failed to update profile' })
        return
      }

      response.status(200).json({
        id: user.user.id,
        email: user.user.email,
        name: user.user.user_metadata?.name || user.user.email,
        given_name: user.user.user_metadata?.given_name || null,
        family_name: user.user.user_metadata?.family_name || null,
        email_verified: user.user.email_confirmed_at !== null,
      })
    } catch (error) {
      console.error('[updateProfileRoute] Error:', error)
      response.status(500).json({ error: 'Internal server error' })
    }
  }
)
