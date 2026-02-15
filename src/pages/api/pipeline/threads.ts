import { NextApiRequest, NextApiResponse } from 'next'

import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'
import { withApiAuth } from '@/server/utils'
import { getActiveThreads } from '@/langgraph/utils/thread-lookup'

const listThreads = withApiAuth(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const threads = await getActiveThreads()

    res.status(200).json({
      data: { threads },
      status: 200,
    })
  } catch (error: unknown) {
    console.error('[Pipeline Threads] Error:', error)
    res.status(500).json({
      error: 'Failed to list threads',
      status: 500,
    })
  }
})

export default apiRequestWrapper({
  [HttpMethod.GET]: listThreads,
})
