import { NextApiRequest, NextApiResponse } from 'next'

import { HttpResponse } from '@/server/types'

import { ConsultationRequestsService } from './consultation-requests.service'
import { CreateConsultationRequestInput, ConsultationRequest } from './consultation-requests.types'

/**
 * POST /api/consultation-requests
 * Public route — no authentication required (landing page form)
 */
export const createConsultationRequestController = async (
  req: NextApiRequest,
  res: NextApiResponse<HttpResponse<{ consultation_request: ConsultationRequest | null }>>
) => {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({
        data: { consultation_request: null },
        status: 405,
      })
      return
    }

    const input: CreateConsultationRequestInput = req.body

    const consultationRequest = await ConsultationRequestsService.create(input)

    res.status(201).json({
      data: { consultation_request: consultationRequest },
      status: 201,
    })
  } catch (error: unknown) {
    console.error('[createConsultationRequest] Error:', error)

    const message = error instanceof Error ? error.message : 'Failed to create consultation request'
    const status = error instanceof Error && error.message.includes('required') ? 400 : 500

    res.status(status).json({
      data: { consultation_request: null },
      status,
      message,
    } as any)
  }
}
