import { GetServerSidePropsContext } from 'next'

import { querySupabase } from '@/db'
import { UserGroup } from '@/interfaces/user'

import { getNextAuthJWT } from '../getNextAuthJWT'
import { getSupabaseSession } from '../supabase/getSupabaseSession'

interface UserRoleRow {
  role: string
}

export const getUser = async <T extends GetServerSidePropsContext['req']>(req: T) => {
  // First try NextAuth session
  let session = await getNextAuthJWT(req)
  let userId: string | undefined
  let name: string | undefined
  let email: string | null = null

  // If no NextAuth session, try Supabase session from cookies
  if (!session) {
    const supabaseSession = await getSupabaseSession(req as any)
    if (supabaseSession?.user) {
      userId = supabaseSession.user.id
      name = supabaseSession.user.user_metadata?.name || supabaseSession.user.email || undefined
      email = supabaseSession.user.email || null
    }
  } else {
    // Extract from NextAuth session
    userId = (session as any)?.id || (session as any)?.user?.id
    name = (session as any)?.name || (session as any)?.user?.name
    email = (session as any)?.email || (session as any)?.user?.email || null
  }

  let roles: UserGroup[] = []

  // Fetch roles from Supabase if we have a user ID
  if (userId) {
    try {
      const roleRows = await querySupabase<UserRoleRow>('users/get_user_roles.sql', [userId])
      roles = roleRows.map((row) => {
        // Map database role values to UserGroup enum
        switch (row.role) {
          case 'admin':
            return UserGroup.Admin
          case 'vip':
            return UserGroup.Vip
          case 'default':
            return UserGroup.Default
          default:
            return UserGroup.Default
        }
      })
    } catch (error) {
      console.error('Error fetching user roles from Supabase:', error)
      // Keep roles as empty array on error — user will have no access
      roles = []
    }
  }

  const userProfile = {
    name: name || 'placeholder_name',
    email,
    roles,
  }

  return userProfile
}
