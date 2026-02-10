import { NextApiRequest, NextApiResponse } from 'next'

import { getSession } from '@/apis/routes/auth/supabase/session'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return getSession(req, res)
}
