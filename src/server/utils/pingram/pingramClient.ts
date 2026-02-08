import { Pingram } from 'pingram'

const PINGRAM_API_KEY = process.env.PINGRAM_API_KEY
const PINGRAM_API_BASE_URL = process.env.PINGRAM_API_BASE_URL ?? 'https://api.pingram.io'

if (!PINGRAM_API_KEY) {
  console.warn('[Pingram] PINGRAM_API_KEY is not set — SMS sends will fail at runtime')
}

const pingram = PINGRAM_API_KEY
  ? new Pingram({ apiKey: PINGRAM_API_KEY, baseUrl: PINGRAM_API_BASE_URL })
  : null

export type SendSmsPayload = {
  /** Notification type/slug — defaults to 'workpace_prototypes' */
  type?: string
  to: {
    /** Recipient identifier (email or user id) */
    id: string
    /** Phone number in E.164 format, e.g. "+15551234567" */
    number: string
  }
  sms: {
    message: string
  }
  metadata?: Record<string, unknown>
}

export type PingramSendResponse = {
  id?: string
  status?: string
  [key: string]: unknown
}

export class PingramApiError extends Error {
  status: number
  body: string

  constructor(status: number, body: string) {
    super(`Pingram SMS failed (${status}): ${body}`)
    this.name = 'PingramApiError'
    this.status = status
    this.body = body
  }
}

/**
 * Send an SMS via the Pingram SDK.
 */
export async function sendPingramSms(payload: SendSmsPayload): Promise<PingramSendResponse> {
  if (!pingram) {
    throw new Error('PINGRAM_API_KEY is not set')
  }

  try {
    const result = await pingram.send({
      type: payload.type ?? 'workpace_prototypes',
      to: {
        id: payload.to.id,
        number: payload.to.number,
      },
      sms: {
        message: payload.sms.message,
      },
    })

    return result as unknown as PingramSendResponse
  } catch (err: unknown) {
    console.error('[Pingram] SDK send error', err)

    if (err instanceof Error) {
      throw new PingramApiError(500, err.message)
    }

    throw new PingramApiError(500, String(err))
  }
}
