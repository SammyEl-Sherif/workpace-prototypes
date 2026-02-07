import { NextApiRequest, NextApiResponse } from 'next'

import { verify } from '@/apis/routes/auth/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return verify(req, res)
}
