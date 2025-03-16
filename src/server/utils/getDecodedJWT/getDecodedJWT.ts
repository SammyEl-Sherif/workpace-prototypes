import jwtDecode from 'jwt-decode'

import { IdToken, UserGroup } from '@/interfaces/user'

export const getDecodedJWT = (token: string): { roles: UserGroup[] } => {
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
