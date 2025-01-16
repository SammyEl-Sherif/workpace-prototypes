import { PocketbaseServerSide as pb } from '@/utils'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username, password } = req.body
  try {
    const authData = await pb
      .collection('_superusers')
      .authWithPassword(process.env.PB_ADMIN_USERNAME ?? '', process.env.PB_ADMIN_PASSWORD ?? '')

    res.setHeader(
      'Set-Cookie',
      `pb_auth=${pb.authStore.exportToCookie()}; HttpOnly=${false}; Secure=${
        process.env.NODE_ENV === 'production'
      }; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}; Path=/`
    )

    res.status(200).json({ user: authData.record })
  } catch (error) {
    res.status(400).json({ error })
  }
}
