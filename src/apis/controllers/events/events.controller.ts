import { NextApiRequest, NextApiResponse } from 'next'

import { EventsService, EventGuestsService } from './events.service'
import { sendEventInvites } from './event-invites.service'
import { CreateEventInput, UpdateEventInput, CreateEventGuestInput } from '@/interfaces/events'
import { HttpResponse } from '@/server/types'
import { withSupabaseAuth } from '@/server/utils'

// ─── Events CRUD ────────────────────────────────────────────────────────────

export const getEventsController = withSupabaseAuth(
  async (req: NextApiRequest, res: NextApiResponse<HttpResponse<{ events: any[] }>>, session) => {
    try {
      if (!session.user) {
        res.status(401).json({ data: { events: [] }, status: 401 })
        return
      }

      const events = await EventsService.getAll(session.user.id)
      res.status(200).json({ data: { events }, status: 200 })
    } catch (error: unknown) {
      res.status(500).json({ data: { events: [] }, status: 500 })
    }
  }
)

export const getEventByIdController = withSupabaseAuth(
  async (
    req: NextApiRequest,
    res: NextApiResponse<HttpResponse<{ event: any | null }>>,
    session
  ) => {
    try {
      if (!session.user) {
        res.status(401).json({ data: { event: null }, status: 401 })
        return
      }

      const { id } = req.query
      if (!id || typeof id !== 'string') {
        res.status(400).json({ data: { event: null }, status: 400 })
        return
      }

      const event = await EventsService.getWithGuests(id, session.user.id)
      if (!event) {
        res.status(404).json({ data: { event: null }, status: 404 })
        return
      }

      res.status(200).json({ data: { event }, status: 200 })
    } catch (error: unknown) {
      res.status(500).json({ data: { event: null }, status: 500 })
    }
  }
)

export const createEventController = withSupabaseAuth(
  async (req: NextApiRequest, res: NextApiResponse<HttpResponse<{ event: any }>>, session) => {
    try {
      if (req.method !== 'POST') {
        res.status(405).json({ data: { event: null as any }, status: 405 })
        return
      }

      if (!session.user) {
        res.status(401).json({ data: { event: null as any }, status: 401 })
        return
      }

      const input: CreateEventInput = req.body

      const event = await EventsService.create(session.user.id, input)

      // Optionally create guests in the same request
      const guestPhoneNumbers: string[] | undefined = req.body.guest_phone_numbers
      if (guestPhoneNumbers && Array.isArray(guestPhoneNumbers) && guestPhoneNumbers.length > 0) {
        const guestsInput: CreateEventGuestInput[] = guestPhoneNumbers.map((phone) => ({
          phone_number: phone,
        }))
        await EventGuestsService.createBatch(event.id, guestsInput)
      }

      // Return event with guests
      const eventWithGuests = await EventsService.getWithGuests(event.id, session.user.id)

      res.status(201).json({ data: { event: eventWithGuests }, status: 201 })
    } catch (error: unknown) {
      const status = error instanceof Error && error.message.includes('required') ? 400 : 500
      res.status(status).json({ data: { event: null as any }, status })
    }
  }
)

export const updateEventController = withSupabaseAuth(
  async (req: NextApiRequest, res: NextApiResponse<HttpResponse<{ event: any }>>, session) => {
    try {
      if (req.method !== 'PUT' && req.method !== 'PATCH') {
        res.status(405).json({ data: { event: null as any }, status: 405 })
        return
      }

      if (!session.user) {
        res.status(401).json({ data: { event: null as any }, status: 401 })
        return
      }

      const { id } = req.query
      if (!id || typeof id !== 'string') {
        res.status(400).json({ data: { event: null as any }, status: 400 })
        return
      }

      const input: UpdateEventInput = req.body
      const event = await EventsService.update(id, session.user.id, input)

      res.status(200).json({ data: { event }, status: 200 })
    } catch (error: unknown) {
      const status =
        error instanceof Error && error.message.includes('not found')
          ? 404
          : error instanceof Error && error.message.includes('required')
          ? 400
          : 500
      res.status(status).json({ data: { event: null as any }, status })
    }
  }
)

export const deleteEventController = withSupabaseAuth(
  async (
    req: NextApiRequest,
    res: NextApiResponse<HttpResponse<{ success: boolean }>>,
    session
  ) => {
    try {
      if (req.method !== 'DELETE') {
        res.status(405).json({ data: { success: false }, status: 405 })
        return
      }

      if (!session.user) {
        res.status(401).json({ data: { success: false }, status: 401 })
        return
      }

      const { id } = req.query
      if (!id || typeof id !== 'string') {
        res.status(400).json({ data: { success: false }, status: 400 })
        return
      }

      await EventsService.delete(id, session.user.id)

      res.status(200).json({ data: { success: true }, status: 200 })
    } catch (error: unknown) {
      const status = error instanceof Error && error.message.includes('not found') ? 404 : 500
      res.status(status).json({ data: { success: false }, status })
    }
  }
)

// ─── Event Guests ───────────────────────────────────────────────────────────

export const addEventGuestsController = withSupabaseAuth(
  async (req: NextApiRequest, res: NextApiResponse<HttpResponse<{ guests: any[] }>>, session) => {
    try {
      if (req.method !== 'POST') {
        res.status(405).json({ data: { guests: [] }, status: 405 })
        return
      }

      if (!session.user) {
        res.status(401).json({ data: { guests: [] }, status: 401 })
        return
      }

      const { id } = req.query // event id
      if (!id || typeof id !== 'string') {
        res.status(400).json({ data: { guests: [] }, status: 400 })
        return
      }

      // Verify the user owns this event
      const event = await EventsService.getById(id, session.user.id)
      if (!event) {
        res.status(403).json({ data: { guests: [] }, status: 403 })
        return
      }

      const guestsInput: CreateEventGuestInput[] = req.body.guests
      if (!Array.isArray(guestsInput) || guestsInput.length === 0) {
        res.status(400).json({ data: { guests: [] }, status: 400 })
        return
      }

      const guests = await EventGuestsService.createBatch(id, guestsInput)

      res.status(201).json({ data: { guests }, status: 201 })
    } catch (error: unknown) {
      res.status(500).json({ data: { guests: [] }, status: 500 })
    }
  }
)

// ─── Send Invites via Pingram ───────────────────────────────────────────────

export const sendEventInvitesController = withSupabaseAuth(
  async (
    req: NextApiRequest,
    res: NextApiResponse<HttpResponse<{ total: number; sent: number; failed: number }>>,
    session
  ) => {
    try {
      if (req.method !== 'POST') {
        res.status(405).json({ data: { total: 0, sent: 0, failed: 0 }, status: 405 })
        return
      }

      if (!session.user) {
        res.status(401).json({ data: { total: 0, sent: 0, failed: 0 }, status: 401 })
        return
      }

      const { id } = req.query // event id
      if (!id || typeof id !== 'string') {
        res.status(400).json({ data: { total: 0, sent: 0, failed: 0 }, status: 400 })
        return
      }

      // Verify the user owns this event
      const event = await EventsService.getById(id, session.user.id)
      if (!event) {
        res.status(403).json({ data: { total: 0, sent: 0, failed: 0 }, status: 403 })
        return
      }

      const timeZone: string | undefined = req.body.time_zone
      const eventUrlBase = process.env.APP_URL
        ? `${process.env.APP_URL}/events`
        : 'https://yourapp.com/events'

      const result = await sendEventInvites({
        eventId: id,
        eventUrlBase,
        timeZone,
      })

      res.status(200).json({
        data: { total: result.total, sent: result.sent, failed: result.failed },
        status: 200,
      })
    } catch (error: unknown) {
      console.error('[sendEventInvitesController]', error)
      res.status(500).json({ data: { total: 0, sent: 0, failed: 0 }, status: 500 })
    }
  }
)
