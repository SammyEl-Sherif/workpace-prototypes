import { NextApiRequest, NextApiResponse } from 'next'

import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'
import { withApiAuth } from '@/server/utils'
import { createGraph } from '@/langgraph/graph'

const startPipeline = withApiAuth(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== HttpMethod.POST) {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { clientName, clientEmail, clientPhone, source, meetingDatetime } = req.body

  if (!clientName || !clientEmail || !clientPhone) {
    res.status(400).json({ error: 'clientName, clientEmail, and clientPhone are required' })
    return
  }

  try {
    const graph = await createGraph()
    const threadId = crypto.randomUUID()

    const result = await graph.invoke(
      {
        clientName,
        clientEmail,
        clientPhone,
        source: source || 'Manual',
        meetingDatetime: meetingDatetime || null,
        status: 'new_lead',
        meetingNotes: null,
        pricingDiscussed: null,
        portalLink: null,
        portalSignupComplete: false,
        orgId: null,
        intakeFormResponses: null,
        scopeOfWorkDraft: null,
        contractId: null,
        contractEnvelopeId: null,
        contractSigned: false,
        contractSignedUrl: null,
        projectPageId: null,
        reminderCount: 0,
        lastActivity: new Date().toISOString(),
        adminDecision: null,
        error: null,
      },
      { configurable: { thread_id: threadId } }
    )

    res.status(201).json({
      data: { threadId, result },
      status: 201,
    })
  } catch (error: unknown) {
    console.error('[Pipeline Start] Error:', error)
    res.status(500).json({
      error: 'Failed to start pipeline',
      status: 500,
    })
  }
})

export default apiRequestWrapper({
  [HttpMethod.POST]: startPipeline,
})
