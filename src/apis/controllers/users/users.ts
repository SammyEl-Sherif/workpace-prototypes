import { UsersService, CreateUserInput } from '@/services/users/users.service'
import { HttpResponse } from '@/server/types'

export const createUserController = async (
  input: CreateUserInput
): Promise<HttpResponse<unknown>> => {
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
  } catch (error: any) {
    // Handle unique constraint violations (e.g., duplicate auth0_user_id or email)
    if (error.code === '23505') {
      // PostgreSQL unique violation error code
      if (error.constraint === 'users_auth0_user_id_unique') {
        return {
          data: { error: 'User with this auth0_user_id already exists' },
          status: 409,
        }
      }
      if (error.constraint === 'idx_users_email_active_unique') {
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

    return {
      data: { error: error.message || 'Internal server error' },
      status: error.statusCode || 500,
    }
  }
}
