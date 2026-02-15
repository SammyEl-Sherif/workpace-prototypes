import { NextApiRequest, NextApiResponse } from 'next'

import { checkTimeouts } from '@/langgraph/utils/reminders'

const CRON_SECRET = process.env.CRON_SECRET ?? ''

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  // Verify the request is from Vercel Cron
  const authHeader = req.headers.authorization
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  try {
    await checkTimeouts()
    res.status(200).json({ ok: true })
  } catch (error: unknown) {
    console.error('[Pipeline Cron] Reminder check failed:', error)
    res.status(500).json({ error: 'Reminder check failed' })
  }
}
