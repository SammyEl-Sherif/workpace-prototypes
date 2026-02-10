import { NextApiRequest, NextApiResponse } from 'next'

import { sync } from '@/apis/routes/auth/supabase/sync'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return sync(req, res)
}
