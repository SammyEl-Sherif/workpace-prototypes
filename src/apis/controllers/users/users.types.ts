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
