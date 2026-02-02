import { NextApiRequest, NextApiResponse } from 'next'

import { signin } from '@/apis/routes/auth/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return signin(req, res)
}
