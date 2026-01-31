import { HttpResponse } from '@/server/types'

import { UsersService } from './users.service'
import { CreateUserInput, User } from './users.types'

interface PostgresError extends Error {
  code?: string
  constraint?: string
}

export const createUserController = async (
  input: CreateUserInput
): Promise<HttpResponse<{ data: User } | { error: string }>> => {
  try {
    // Validate required field
    if (!input.auth0_user_id) {
      return {
        data: { error: 'auth0_user_id is required' },
        status: 400,
      }
    }

    const user = await UsersService.createUser(input)

    return {
      data: { data: user },
      status: 201,
    }
  } catch (error) {
    const pgError = error as PostgresError

    // Handle unique constraint violations
    if (pgError.code === '23505') {
      if (pgError.constraint === 'users_auth0_user_id_unique') {
        return {
          data: { error: 'User with this auth0_user_id already exists' },
          status: 409,
        }
      }
      if (pgError.constraint === 'idx_users_email_active_unique') {
        return {
          data: { error: 'User with this email already exists' },
          status: 409,
        }
      }
      return {
        data: { error: 'User already exists' },
        status: 409,
      }
    }

    console.error('[createUserController] Error:', error)
    return {
      data: { error: 'Failed to create user' },
      status: 500,
    }
  }
}
