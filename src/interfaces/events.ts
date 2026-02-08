export type InviteStatus = 'pending' | 'sent' | 'bounced' | 'confirmed' | 'declined'

export interface Event {
  id: string
  creator_user_id: string
  title: string
  description: string | null
  starts_at: string
  location: string | null
  created_at: string
  updated_at: string
}

export interface EventGuest {
  id: string
  event_id: string
  user_id: string | null
  phone_number: string
  name: string | null
  invite_status: InviteStatus
  sms_invite_message_id: string | null
  last_invite_sent_at: string | null
  created_at: string
  updated_at: string
}

export interface EventWithGuests extends Event {
  guests: EventGuest[]
}

export interface CreateEventInput {
  title: string
  description?: string | null
  starts_at: string
  location?: string | null
}

export interface UpdateEventInput {
  title?: string
  description?: string | null
  starts_at?: string
  location?: string | null
}

export interface CreateEventGuestInput {
  phone_number: string
  name?: string | null
  user_id?: string | null
}

export interface SendInvitesInput {
  event_id: string
  time_zone?: string
}
