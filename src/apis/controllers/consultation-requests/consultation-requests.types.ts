export interface CreateConsultationRequestInput {
  name: string
  email: string
  company?: string
  service: string
  budget?: string
  timeline?: string
  message?: string
}

export interface ConsultationRequest {
  id: string
  name: string
  email: string
  company: string | null
  service: string
  budget: string | null
  timeline: string | null
  message: string | null
  status: 'requested' | 'in_review' | 'accepted' | 'declined'
  admin_notes: string | null
  created_at: string
  updated_at: string
}
