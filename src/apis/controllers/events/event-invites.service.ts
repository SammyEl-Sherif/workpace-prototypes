import { sendPingramSms } from '@/server/utils/pingram'
import { EventsService, EventGuestsService } from './events.service'
import { EventGuest } from '@/interfaces/events'

/**
 * Format a Date-like value into a human-readable string.
 */
function formatEventDateTime(dt: Date | string, timeZone = 'America/Los_Angeles'): string {
  const date = typeof dt === 'string' ? new Date(dt) : dt
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone,
  }).format(date)
}

export interface SendEventInvitesOptions {
  eventId: string
  /** Base URL for event links, e.g. "https://yourapp.com/events" */
  eventUrlBase: string
  timeZone?: string
}

export interface SendEventInvitesResult {
  total: number
  sent: number
  failed: number
  results: PromiseSettledResult<EventGuest>[]
}

/**
 * Fan-out SMS invites to all guests of an event via Pingram.
 *
 * Call this after the event and its guest rows have been created.
 * It fetches the event, its creator name (from user_metadata or email),
 * and all guests, then sends each guest an SMS.
 */
export async function sendEventInvites(
  options: SendEventInvitesOptions
): Promise<SendEventInvitesResult> {
  const { eventId, eventUrlBase, timeZone } = options

  // 1) Fetch event (internal — ownership already verified by the controller)
  const event = await EventsService.getByIdInternal(eventId)
  if (!event) {
    throw new Error('Event not found')
  }

  // 2) Fetch guests
  const guests = await EventGuestsService.getByEventId(eventId)
  if (guests.length === 0) {
    return { total: 0, sent: 0, failed: 0, results: [] }
  }

  const formattedDateTime = formatEventDateTime(event.starts_at, timeZone ?? 'America/Los_Angeles')
  const eventUrl = `${eventUrlBase}/${event.id}`
  const locationPart = event.location ? ` at ${event.location}` : ''
  const appName = 'WorkPace'

  // 3) Fan out Pingram SMS sends
  const results = await Promise.allSettled(
    guests.map(async (guest) => {
      const guestGreeting = guest.name ? `Hi ${guest.name}, you` : 'You'
      const body = `${guestGreeting} have been invited to "${event.title}" on ${formattedDateTime}${locationPart}. View details: ${eventUrl}\n— ${appName}`

      const res = await sendPingramSms({
        type: 'event_invite',
        to: { phone: guest.phone_number },
        sms: { body },
        metadata: {
          eventId,
          guestId: guest.id,
        },
      })

      // 4) Persist status / message id
      const updated = await EventGuestsService.updateInviteStatus(guest.id, 'sent', res.id ?? null)

      return updated
    })
  )

  // Mark failures as still pending (so they can be retried)
  const failures = results.filter((r) => r.status === 'rejected')
  if (failures.length > 0) {
    console.error(`[EventInvites] ${failures.length}/${guests.length} SMS sends failed`, failures)
  }

  return {
    total: guests.length,
    sent: results.filter((r) => r.status === 'fulfilled').length,
    failed: failures.length,
    results,
  }
}
