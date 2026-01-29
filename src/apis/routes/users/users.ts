import { NextApiRequest, NextApiResponse } from 'next'

import { createUserController } from '@/apis/controllers'
import { CreateUserInput } from '@/services/users/users.service'

export const createUserRoute = async (request: NextApiRequest, response: NextApiResponse) => {
  try {
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
    } = request.body

    const userInput: CreateUserInput = {
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
    }

    const { data, status } = await createUserController(userInput)
    response.status(status).json(data)
  } catch (error: any) {
    response.status(error.statusCode || 500).json({ error: error.message })
  }
}
