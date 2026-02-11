import { NextApiRequest, NextApiResponse } from 'next'

import { createSupabaseServerClient } from '@/server/utils/supabase/createSupabaseClient'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

/**
 * POST /api/sms/webhook
 *
 * Pingram webhook endpoint for receiving inbound SMS messages.
 * This endpoint accepts webhook calls from Pingram and stores them in the database.
 *
 * IMPORTANT: In production, you should verify the webhook signature to ensure
 * the request is actually from Pingram. Add signature verification here.
 */
const webhookController = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const body = req.body

    // Extract message data from Pingram webhook payload
    // Adjust these field names based on actual Pingram webhook format
    const messageBody = body.message || body.text || body.body || body.content || ''
    const senderPhone = body.from || body.sender || body.phone_number || body.from_number || ''
    const senderName = body.sender_name || body.name || null
    const messageId = body.id || body.message_id || body.sid || null
    const receivedAt =
      body.timestamp || body.received_at || body.date_created || new Date().toISOString()
    const subject = body.subject || null // For email support later

    // Validate required fields
    if (!messageBody || typeof messageBody !== 'string' || messageBody.trim().length === 0) {
      res.status(400).json({ error: 'Missing or invalid message body' })
      return
    }

    if (!senderPhone || typeof senderPhone !== 'string') {
      res.status(400).json({ error: 'Missing or invalid sender phone number' })
      return
    }

    // Determine message type (text for SMS, email for email)
    const messageType = body.type === 'email' || body.email ? 'email' : 'text'
    const senderEmail =
      messageType === 'email' ? body.email || body.from_email || senderPhone : null
    const finalSenderPhone = messageType === 'text' ? senderPhone : null

    // Create Supabase client with service role for unauthenticated webhook
    const supabase = createSupabaseServerClient()

    // Insert message into database
    const { data, error } = await supabase
      .from('inbound_messages')
      .insert({
        type: messageType,
        sender_phone_number: finalSenderPhone,
        sender_email: senderEmail,
        sender_name: senderName || null,
        message_body: messageBody.trim(),
        subject: subject || null,
        received_at: receivedAt,
        pingram_message_id: messageId || null,
        raw_payload: body, // Store full payload for debugging
      })
      .select()
      .single()

    if (error) {
      console.error('[SMS Webhook] Database insert error:', error)
      res.status(500).json({ error: 'Failed to store message', details: error.message })
      return
    }

    console.log(
      `[SMS Webhook] Received ${messageType} message from ${
        senderPhone || senderEmail
      }: ${messageBody.substring(0, 50)}...`
    )

    res.status(200).json({ received: true, message_id: data.id })
  } catch (error: unknown) {
    console.error('[SMS Webhook] Error:', error)

    const message = error instanceof Error ? error.message : 'Webhook handler failed'
    res.status(500).json({ error: message })
  }
}

export default apiRequestWrapper({
  [HttpMethod.POST]: webhookController,
})
