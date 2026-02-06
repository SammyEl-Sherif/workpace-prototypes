import { NextApiRequest, NextApiResponse } from 'next'

import { refresh } from '@/apis/routes/auth/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return refresh(req, res)
}
