import { GetServerSidePropsContext } from 'next'

import { querySupabase } from '@/db'
import { UserGroup } from '@/interfaces/user'

import { getNextAuthJWT } from '../getNextAuthJWT'

interface UserRoleRow {
  role: string
}

export const getUser = async <T extends GetServerSidePropsContext['req']>(req: T) => {
  const session = await getNextAuthJWT(req)

  // Extract user ID from session - JWT token stores id at top level
  const userId = (session as any)?.id || (session as any)?.user?.id

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

  // Extract name and email from session
  const name = (session as any)?.name || (session as any)?.user?.name || 'placeholder_name'
  const email = (session as any)?.email || (session as any)?.user?.email || null

  const userProfile = {
    name,
    email,
    roles,
  }

  return userProfile
}
