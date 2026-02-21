import { NextApiRequest, NextApiResponse } from 'next'

import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'
import { withApiAuth } from '@/server/utils'
import { createGraph } from '@/langgraph/graph'
import { Command } from '@langchain/langgraph'
import { logAuditEvent } from '@/langgraph/utils/audit'

const approvePipeline = withApiAuth(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== HttpMethod.POST) {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { threadId } = req.query
  if (!threadId || typeof threadId !== 'string') {
    res.status(400).json({ error: 'threadId is required' })
    return
  }

  const { action, ...data } = req.body
  if (!action) {
    res.status(400).json({ error: 'action is required' })
    return
  }

  try {
    const graph = await createGraph()

    const result = await graph.invoke(new Command({ resume: { action, ...data } }), {
      configurable: { thread_id: threadId },
    })

    await logAuditEvent(threadId, 'approve', 'admin_action', 'admin', { action, ...data })

    res.status(200).json({
      data: { result },
      status: 200,
    })
  } catch (error: unknown) {
    console.error('[Pipeline Approve] Error:', error)
    res.status(500).json({
      error: 'Failed to process approval',
      status: 500,
    })
  }
})

export default apiRequestWrapper({
  [HttpMethod.POST]: approvePipeline,
})
