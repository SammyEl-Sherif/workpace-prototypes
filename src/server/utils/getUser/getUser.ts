import { GetServerSidePropsContext } from 'next'

import { getDecodedJWT } from '../getDecodedJWT'
import { getNextAuthJWT } from '../getNextAuthJWT'

export const getUser = async <T extends GetServerSidePropsContext['req']>(req: T) => {
  const session = await getNextAuthJWT(req)
  const accessToken = session?.account?.access_token

  const { roles } = accessToken ? getDecodedJWT(accessToken) : { roles: [] }
  // const permissions = await getUserPermissions(session) // dont need this yet, just return roles

  const userProfile = {
    name: 'placeholder_name',
    roles,
  }

  return userProfile
}
