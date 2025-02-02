import PocketBase from 'pocketbase'

import { SuperusersRecord } from '@/pocketbase-types'
import { HttpResponse } from '@/server/types'

type LoginPayload = {
  email: string
  password: string
}

export const loginUserController = async (
  pbc: PocketBase,
  { email, password }: LoginPayload
): Promise<HttpResponse<any | null>> => {
  try {
    const authRecord = await pbc
      .collection('_superusers')
      .authWithPassword(email ?? '', password ?? '')

    return {
      data: authRecord,
      status: 200,
    }
  } catch (error) {
    return {
      data: null,
      status: 500,
    }
  }
}
