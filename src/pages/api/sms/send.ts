import { NextApiRequest, NextApiResponse } from 'next'

import { sendPingramSms, PingramApiError } from '@/server/utils/pingram'
import { HttpResponse } from '@/server/types'
import { withApiAuth } from '@/server/utils'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

const sendSmsController = withApiAuth(
  async (
    req: NextApiRequest,
    res: NextApiResponse<HttpResponse<{ message_id: string | null; sent: boolean }>>,
    session
  ) => {
    try {
      const userId = (session as any)?.id || (session as any)?.sub

      const { phone, message } = req.body as { phone?: string; message?: string }
      const userEmail = (session as any)?.email ?? userId ?? 'unknown'

      if (!phone || typeof phone !== 'string' || phone.trim().length < 8) {
        res.status(400).json({ data: { message_id: null, sent: false }, status: 400 })
        return
      }

      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        res.status(400).json({ data: { message_id: null, sent: false }, status: 400 })
        return
      }

      const result = await sendPingramSms({
        type: 'workpace_apps',
        to: {
          id: String(userEmail),
          number: phone.trim(),
        },
        sms: { message: message.trim() },
      })

      res.status(200).json({
        data: { message_id: result.id ?? null, sent: true },
        status: 200,
      })
    } catch (error: unknown) {
      console.error('[sendSms]', error)

      const message =
        error instanceof PingramApiError
          ? `Pingram error (${error.status}): ${error.body}`
          : error instanceof Error
          ? error.message
          : 'Unknown error'

      res.status(502).json({
        data: { message_id: null, sent: false },
        status: 502,
        message,
      } as any)
    }
  }
)

export default apiRequestWrapper({
  [HttpMethod.POST]: sendSmsController,
})
