import { querySupabase } from '@/db'

import { CreateConsultationRequestInput, ConsultationRequest } from './consultation-requests.types'

export const ConsultationRequestsService = {
  async create(input: CreateConsultationRequestInput): Promise<ConsultationRequest> {
    if (!input.name || input.name.trim() === '') {
      throw new Error('Name is required')
    }

    if (!input.email || input.email.trim() === '') {
      throw new Error('Email is required')
    }

    if (!input.service || input.service.trim() === '') {
      throw new Error('Service is required')
    }

    const results = await querySupabase<ConsultationRequest>(
      'consultation_requests/create.sql',
      [
        input.name.trim(),
        input.email.trim(),
        input.company?.trim() || null,
        input.service.trim(),
        input.budget?.trim() || null,
        input.timeline?.trim() || null,
        input.message?.trim() || null,
      ]
    )

    if (results.length === 0) {
      throw new Error('Failed to create consultation request')
    }

    return results[0]
  },
}
