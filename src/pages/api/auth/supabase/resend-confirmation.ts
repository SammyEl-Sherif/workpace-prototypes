import { NextApiRequest, NextApiResponse } from 'next'

import { resendConfirmation } from '@/apis/routes/auth/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return resendConfirmation(req, res)
}
