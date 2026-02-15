import { NextApiRequest, NextApiResponse } from 'next'

import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'
import { withApiAuth } from '@/server/utils'
import { createGraph } from '@/langgraph/graph'
import { getAuditLog } from '@/langgraph/utils/audit'

const getStatus = withApiAuth(async (req: NextApiRequest, res: NextApiResponse) => {
  const { threadId } = req.query
  if (!threadId || typeof threadId !== 'string') {
    res.status(400).json({ error: 'threadId is required' })
    return
  }

  try {
    const graph = await createGraph()
    const state = await graph.getState({ configurable: { thread_id: threadId } })
    const auditLog = await getAuditLog(threadId)

    res.status(200).json({
      data: {
        state: state.values,
        next: state.next,
        auditLog,
      },
      status: 200,
    })
  } catch (error: unknown) {
    console.error('[Pipeline Status] Error:', error)
    res.status(500).json({
      error: 'Failed to get pipeline status',
      status: 500,
    })
  }
})

export default apiRequestWrapper({
  [HttpMethod.GET]: getStatus,
})
