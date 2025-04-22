import { SessionAccount } from '@/interfaces/user'
import auth from '@/pages/api/auth/[...nextauth]'
import { createHttpClient, getNextAuthJWT, getSession } from '@/server/utils'
import { NextApiRequest, NextApiResponse } from 'next'

const revokeSession = async (req: NextApiRequest, res: NextApiResponse) => {
  // const session = await getSession(req, res) // TODO: investigate why getServerSession throws error
  const session = await getNextAuthJWT(req)
  const authToken = `Basic ${Buffer.from(
    `${process.env.AUTH0_CLIENT_ID}:${process.env.AUTH0_SECRET}`,
    'utf8'
  ).toString('base64')}`

  const url = `${process.env.AUTH0_ISSUER_BASE_URL}/oauth/revoke`

  const params = {}

  if (session) {
    const account: SessionAccount | any = session.account
    Object.assign(params, {
      token: account?.access_token,
      token_type_hint: 'access_token',
    })
  }
  // TODO: Investigate 500 revoke session
  // const instance = createHttpClient()

  // const { statusText, status } = await instance.request({
  //   url,
  //   method: 'POST',
  //   headers: {
  //     Accept: 'application/json',
  //     Authorization: authToken,
  //     'Content-Type': 'application/json',
  //     'cache-control': 'no-cache',
  //   },
  //   data: params,
  //   timeout: 0,
  // })

  res.status(200)
  // res.send(statusText)
}

export default revokeSession
