import { querySupabase } from '@/db'

export interface User {
  id: string
  auth0_user_id: string
  email?: string | null
  email_verified: boolean
  name?: string | null
  given_name?: string | null
  family_name?: string | null
  picture_url?: string | null
  is_active: boolean
  blocked: boolean
  last_login_at?: string | null
  app_metadata: Record<string, unknown>
  user_metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface CreateUserInput {
  auth0_user_id: string
  email?: string | null
  email_verified?: boolean
  name?: string | null
  given_name?: string | null
  family_name?: string | null
  picture_url?: string | null
  is_active?: boolean
  blocked?: boolean
  last_login_at?: string | null
  app_metadata?: Record<string, unknown>
  user_metadata?: Record<string, unknown>
}

export const UsersService = {
  async createUser(input: CreateUserInput): Promise<User> {
    const {
      auth0_user_id,
      email,
      email_verified,
      name,
      given_name,
      family_name,
      picture_url,
      is_active,
      blocked,
      last_login_at,
      app_metadata,
      user_metadata,
    } = input

    // Validate required field
    if (!auth0_user_id || auth0_user_id.trim() === '') {
      throw new Error('auth0_user_id is required')
    }

    // Prepare query parameters
    // Note: pg library automatically converts JavaScript objects to JSONB
    const queryParams: (string | boolean | Record<string, unknown> | null)[] = [
      auth0_user_id.trim(),
      email?.trim() || null,
      email_verified ?? null,
      name?.trim() || null,
      given_name?.trim() || null,
      family_name?.trim() || null,
      picture_url?.trim() || null,
      is_active ?? null,
      blocked ?? null,
      last_login_at || null,
      app_metadata || null,
      user_metadata || null,
    ]

    const results = await querySupabase<User>('users/create_user.sql', queryParams)

    if (results.length === 0) {
      throw new Error('Failed to create user')
    }

    return results[0]
  },
}
