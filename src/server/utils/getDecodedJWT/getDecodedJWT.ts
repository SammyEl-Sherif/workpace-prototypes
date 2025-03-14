import jwtDecode from 'jwt-decode'

import { UserGroup } from '@/interfaces/user'

interface IdToken {
  'https://workpace.io/roles'?: UserGroup[]
  nickname?: string
  name?: string
  picture?: string
  updated_at?: string
  email?: string
  email_verified?: boolean
  iss?: string
  aud?: string
  sub?: string
  iat?: number
  exp?: number
  sid?: string
  auth_time?: number
}

export const getDecodedJWT = (token: string): { roles: UserGroup[] } => {
  console.log('testing_getdecodedjwt', token)
  try {
    const userData = jwtDecode(token ?? '') as IdToken

    return {
      roles: Array.isArray(userData['https://workpace.io/roles'])
        ? userData['https://workpace.io/roles']
        : [],
    }
  } catch (error) {
    console.error('Error decoding JWT', error)
    return { roles: [] }
  }
}
