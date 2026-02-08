import { querySupabase } from '@/db'
import {
  Event,
  EventGuest,
  EventWithGuests,
  CreateEventInput,
  UpdateEventInput,
  CreateEventGuestInput,
} from '@/interfaces/events'

export const EventsService = {
  async getAll(userId: string): Promise<Event[]> {
    return querySupabase<Event>('events/get_all.sql', [userId])
  },

  async getById(id: string, userId: string): Promise<Event | null> {
    const results = await querySupabase<Event>('events/get_by_id.sql', [id, userId])
    return results[0] || null
  },

  /**
   * Internal fetch — no user scoping. Use only after ownership has been verified.
   */
  async getByIdInternal(id: string): Promise<Event | null> {
    const results = await querySupabase<Event>('events/get_by_id_internal.sql', [id])
    return results[0] || null
  },

  async getWithGuests(id: string, userId: string): Promise<EventWithGuests | null> {
    const event = await this.getById(id, userId)
    if (!event) return null

    const guests = await EventGuestsService.getByEventId(event.id)
    return { ...event, guests }
  },

  async create(userId: string, input: CreateEventInput): Promise<Event> {
    if (!input.title || input.title.trim() === '') {
      throw new Error('Title is required')
    }
    if (!input.starts_at) {
      throw new Error('Start time is required')
    }

    const results = await querySupabase<Event>('events/create.sql', [
      userId,
      input.title.trim(),
      input.description?.trim() || null,
      input.starts_at,
      input.location?.trim() || null,
    ])

    if (results.length === 0) {
      throw new Error('Failed to create event')
    }

    return results[0]
  },

  async update(id: string, userId: string, input: UpdateEventInput): Promise<Event> {
    const results = await querySupabase<Event>('events/update.sql', [
      id,
      userId,
      input.title?.trim() || null,
      input.description !== undefined ? input.description?.trim() || null : undefined,
      input.starts_at || null,
      input.location !== undefined ? input.location?.trim() || null : undefined,
    ])

    if (results.length === 0) {
      throw new Error('Event not found or you do not have permission to update it')
    }

    return results[0]
  },

  async delete(id: string, userId: string): Promise<void> {
    const results = await querySupabase<Event>('events/delete.sql', [id, userId])

    if (results.length === 0) {
      throw new Error('Event not found or you do not have permission to delete it')
    }
  },
}

export const EventGuestsService = {
  async getByEventId(eventId: string): Promise<EventGuest[]> {
    return querySupabase<EventGuest>('event_guests/get_by_event_id.sql', [eventId])
  },

  async create(eventId: string, input: CreateEventGuestInput): Promise<EventGuest> {
    if (!input.phone_number || input.phone_number.trim() === '') {
      throw new Error('Phone number is required')
    }

    const results = await querySupabase<EventGuest>('event_guests/create.sql', [
      eventId,
      input.phone_number.trim(),
      input.name?.trim() || null,
      input.user_id || null,
    ])

    if (results.length === 0) {
      throw new Error('Failed to create event guest')
    }

    return results[0]
  },

  async createBatch(eventId: string, guests: CreateEventGuestInput[]): Promise<EventGuest[]> {
    const created: EventGuest[] = []
    for (const guest of guests) {
      const result = await this.create(eventId, guest)
      created.push(result)
    }
    return created
  },

  async updateInviteStatus(
    guestId: string,
    status: string,
    messageId: string | null
  ): Promise<EventGuest> {
    const results = await querySupabase<EventGuest>('event_guests/update_invite_status.sql', [
      guestId,
      status,
      messageId,
    ])

    if (results.length === 0) {
      throw new Error('Event guest not found')
    }

    return results[0]
  },

  async delete(guestId: string, eventId: string): Promise<void> {
    const results = await querySupabase<EventGuest>('event_guests/delete.sql', [guestId, eventId])

    if (results.length === 0) {
      throw new Error('Event guest not found')
    }
  },
}
