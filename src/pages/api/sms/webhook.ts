import { NextApiRequest, NextApiResponse } from 'next'

import { createSupabaseServerClient } from '@/server/utils/supabase/createSupabaseClient'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'
import { sendPingramSms } from '@/server/utils/pingram'
import { createNotionClient } from '@/server/utils/createHttpClient/createNotionClient/createNotionClient'
import { getNotionPagesController } from '@/apis/controllers/notion/pages/pages'

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

    // Check if we've already processed this message (deduplication)
    // This prevents duplicate processing if Pingram retries the webhook
    if (messageId) {
      const { data: existingMessage } = await supabase
        .from('inbound_messages')
        .select('id, raw_payload')
        .eq('pingram_message_id', messageId)
        .maybeSingle()

      if (existingMessage) {
        // Check if we've already sent a reply for this message
        if (existingMessage.raw_payload?.chief_of_staff_reply_sent) {
          console.log(
            `[SMS Webhook] Message ${messageId} already processed with reply sent, skipping duplicate`
          )
          res.status(200).json({ received: true, message_id: existingMessage.id, duplicate: true })
          return
        }

        // Check if currently being processed
        if (existingMessage.raw_payload?.chief_of_staff_processing) {
          const processingAt = existingMessage.raw_payload.chief_of_staff_processing_at
          if (processingAt) {
            const processingTime = new Date(processingAt).getTime()
            const now = Date.now()
            // If processing started less than 60 seconds ago, skip
            if (now - processingTime < 60000) {
              console.log(
                `[SMS Webhook] Message ${messageId} is already being processed (started ${Math.round(
                  (now - processingTime) / 1000
                )}s ago), skipping duplicate`
              )
              res
                .status(200)
                .json({ received: true, message_id: existingMessage.id, duplicate: true })
              return
            }
          }
        }

        // Message exists but hasn't been processed yet - use existing message ID
        console.log(
          `[SMS Webhook] Message ${messageId} already exists in database, using existing record`
        )
        // Continue with existing message - we'll handle the outlook processing below
      }
    }

    // Insert message into database (only if it doesn't already exist)
    let data
    if (messageId) {
      // Check again if message exists (race condition protection)
      const { data: existingCheck } = await supabase
        .from('inbound_messages')
        .select('*')
        .eq('pingram_message_id', messageId)
        .maybeSingle()

      if (existingCheck) {
        // Use existing message
        data = existingCheck
        console.log(`[SMS Webhook] Using existing message record for ${messageId}`)
      } else {
        // Insert new message
        const { data: inserted, error } = await supabase
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
          // If it's a duplicate key error, try to fetch the existing record
          if (error.code === '23505' || error.message?.includes('duplicate')) {
            const { data: existing } = await supabase
              .from('inbound_messages')
              .select('*')
              .eq('pingram_message_id', messageId)
              .maybeSingle()
            if (existing) {
              data = existing
              console.log(`[SMS Webhook] Duplicate insert prevented, using existing message`)
            } else {
              console.error('[SMS Webhook] Database insert error:', error)
              res.status(500).json({ error: 'Failed to store message', details: error.message })
              return
            }
          } else {
            console.error('[SMS Webhook] Database insert error:', error)
            res.status(500).json({ error: 'Failed to store message', details: error.message })
            return
          }
        } else {
          data = inserted
        }
      }
    } else {
      // No messageId, just insert
      const { data: inserted, error } = await supabase
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
      data = inserted
    }

    console.log(
      `[SMS Webhook] Received ${messageType} message from ${
        senderPhone || senderEmail
      }: ${messageBody.substring(0, 50)}...`
    )

    // Check if message contains "outlook" (case-insensitive) and handle Chief of Staff task summary request
    if (
      messageType === 'text' &&
      finalSenderPhone &&
      messageBody.toLowerCase().includes('outlook')
    ) {
      try {
        // CRITICAL: Check if we've already sent a reply for an "outlook" message from this phone number
        // within the last 2 minutes. This catches duplicate webhook calls even if they have different message IDs.
        const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString()
        const { data: recentOutlookReplies } = await supabase
          .from('inbound_messages')
          .select('id, raw_payload, received_at')
          .eq('sender_phone_number', finalSenderPhone)
          .eq('type', 'text')
          .ilike('message_body', '%outlook%')
          .gte('received_at', twoMinutesAgo)
          .order('received_at', { ascending: false })

        // Check if any of these recent messages already have a reply sent
        if (recentOutlookReplies && recentOutlookReplies.length > 0) {
          const hasReplySent = recentOutlookReplies.some(
            (msg) => msg.raw_payload?.chief_of_staff_reply_sent
          )

          if (hasReplySent) {
            console.log(
              `[SMS Webhook] Already sent reply for recent "outlook" message from ${finalSenderPhone} (found ${recentOutlookReplies.length} recent messages), skipping duplicate`
            )
            res.status(200).json({ received: true, message_id: data.id, duplicate: true })
            return
          }

          // Check if any are currently being processed (within last 60 seconds)
          const isProcessing = recentOutlookReplies.some((msg) => {
            if (msg.raw_payload?.chief_of_staff_processing) {
              const processingAt = msg.raw_payload.chief_of_staff_processing_at
              if (processingAt) {
                const processingTime = new Date(processingAt).getTime()
                const now = Date.now()
                return now - processingTime < 60000
              }
            }
            return false
          })

          if (isProcessing) {
            console.log(
              `[SMS Webhook] Another "outlook" message from ${finalSenderPhone} is already being processed, skipping duplicate`
            )
            res.status(200).json({ received: true, message_id: data.id, duplicate: true })
            return
          }
        }

        // First, check if we've already sent a reply for this specific message
        const { data: currentMessage } = await supabase
          .from('inbound_messages')
          .select('raw_payload')
          .eq('id', data.id)
          .single()

        if (currentMessage?.raw_payload?.chief_of_staff_reply_sent) {
          console.log(`[SMS Webhook] Message ${data.id} already has reply sent, skipping`)
          res.status(200).json({ received: true, message_id: data.id, duplicate: true })
          return
        }

        // Mark as processing BEFORE calling the handler
        const processingTimestamp = new Date().toISOString()
        const { error: updateError } = await supabase
          .from('inbound_messages')
          .update({
            raw_payload: {
              ...(currentMessage?.raw_payload || data.raw_payload || {}),
              chief_of_staff_processing: true,
              chief_of_staff_processing_at: processingTimestamp,
            },
          })
          .eq('id', data.id)

        if (updateError) {
          console.error('[SMS Webhook] Error marking message as processing:', updateError)
        }

        await handleChiefOfStaffTaskSummary(finalSenderPhone, messageBody, data.id, messageId)
      } catch (error) {
        console.error('[SMS Webhook] Error handling Chief of Staff request:', error)
        // Clear processing flag on error
        await supabase
          .from('inbound_messages')
          .update({
            raw_payload: {
              ...((
                await supabase
                  .from('inbound_messages')
                  .select('raw_payload')
                  .eq('id', data.id)
                  .single()
              ).data?.raw_payload || {}),
              chief_of_staff_processing: false,
            },
          })
          .eq('id', data.id)
        // Don't fail the webhook if Chief of Staff handling fails
      }
    }

    res.status(200).json({ received: true, message_id: data.id })
  } catch (error: unknown) {
    console.error('[SMS Webhook] Error:', error)

    const message = error instanceof Error ? error.message : 'Webhook handler failed'
    res.status(500).json({ error: message })
  }
}

/**
 * Handles "outlook" SMS requests by fetching in-progress tasks from selected databases and sending a summary
 */
async function handleChiefOfStaffTaskSummary(
  senderPhone: string,
  messageBody: string,
  messageDbId: string,
  pingramMessageId: string | null
): Promise<void> {
  const supabase = createSupabaseServerClient()

  // Additional deduplication: Check if another process is already handling this message
  // by checking if the message is marked as processing
  if (pingramMessageId) {
    const { data: existingMessage } = await supabase
      .from('inbound_messages')
      .select('id, raw_payload')
      .eq('pingram_message_id', pingramMessageId)
      .single()

    if (existingMessage?.raw_payload?.chief_of_staff_reply_sent) {
      console.log(`[Chief of Staff] Reply already sent for message ${pingramMessageId}, skipping`)
      return
    }

    // Check if another instance is currently processing (within last 30 seconds)
    if (existingMessage?.raw_payload?.chief_of_staff_processing) {
      const processingAt = existingMessage.raw_payload.chief_of_staff_processing_at
      if (processingAt) {
        const processingTime = new Date(processingAt).getTime()
        const now = Date.now()
        // If processing started less than 30 seconds ago, another instance is handling it
        if (now - processingTime < 30000) {
          console.log(
            `[Chief of Staff] Another instance is processing message ${pingramMessageId}, skipping`
          )
          return
        }
      }
    }
  }

  // Find user by phone number using admin API
  // Note: We need to query auth.users which requires admin access
  const { data: users, error: userError } = await supabase.auth.admin.listUsers()

  if (userError || !users) {
    console.error('[Chief of Staff] Error fetching users:', userError)
    return
  }

  // Normalize phone number for comparison (remove formatting, handle E.164)
  const normalizePhone = (phone: string) => {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '')
    // If it starts with 1 and is 11 digits, it's likely US format, keep as is
    // Otherwise, ensure we're comparing consistently
    return digits
  }
  const normalizedSenderPhone = normalizePhone(senderPhone)

  // Find user with matching phone number
  const user = users.users.find((u) => {
    if (!u.phone) return false
    const normalizedUserPhone = normalizePhone(u.phone)
    // Try exact match first
    if (normalizedUserPhone === normalizedSenderPhone) return true
    // Try matching last 10 digits (for US numbers with/without country code)
    if (
      normalizedUserPhone.length >= 10 &&
      normalizedSenderPhone.length >= 10 &&
      normalizedUserPhone.slice(-10) === normalizedSenderPhone.slice(-10)
    ) {
      return true
    }
    return false
  })

  if (!user) {
    console.log(`[Chief of Staff] No user found for phone: ${senderPhone}`)
    return
  }

  // Get user's Notion connection
  const { data: connection, error: connectionError } = await supabase
    .from('notion_connections')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (connectionError || !connection) {
    console.log(`[Chief of Staff] No Notion connection found for user: ${user.id}`)
    return
  }

  // Get user's selected databases for Chief of Staff
  const { data: selectedDatabases, error: databasesError } = await supabase
    .from('chief_of_staff_databases')
    .select('*')
    .eq('user_id', user.id)

  if (databasesError) {
    console.error('[Chief of Staff] Error fetching selected databases:', databasesError)
    return
  }

  if (!selectedDatabases || selectedDatabases.length === 0) {
    console.log(`[Chief of Staff] No databases selected for user: ${user.id}`)
    // Send a helpful message
    try {
      await sendPingramSms({
        type: 'workpace_apps',
        to: {
          id: user.email || user.id,
          number: senderPhone,
        },
        sms: {
          message:
            "You haven't selected any Notion databases for your morning outlook yet. Visit the SMS app to configure your databases.",
        },
        metadata: {
          type: 'chief_of_staff_no_databases',
          user_id: user.id,
        },
      })
    } catch (smsError) {
      console.error('[Chief of Staff] Error sending SMS reply:', smsError)
    }
    return
  }

  // Create Notion client with user's token
  const notionClient = await createNotionClient(user.id)

  // Query for in-progress tasks across all selected databases
  // Try common status property names and values
  const statusFilters = [
    {
      property: 'Status',
      status: {
        equals: 'In Progress',
      },
    },
    {
      property: 'Status',
      status: {
        equals: 'In progress',
      },
    },
    {
      property: 'Status',
      status: {
        equals: 'in progress',
      },
    },
    {
      property: 'Status',
      status: {
        equals: 'Doing',
      },
    },
    {
      property: 'Status',
      status: {
        equals: 'Active',
      },
    },
  ]

  let allTasks: any[] = []

  // Query each selected database
  for (const selectedDb of selectedDatabases) {
    let databaseTasks: any[] = []

    // Try each status filter
    for (const filter of statusFilters) {
      try {
        const result = await getNotionPagesController(
          notionClient,
          selectedDb.database_id,
          filter as any,
          undefined,
          true, // filter by creator
          user.id
        )
        if (result.data && result.data.length > 0) {
          databaseTasks = result.data
          break // Use first successful filter
        }
      } catch (err) {
        // Try next filter
        continue
      }
    }

    // If no tasks found with status filters, try getting all tasks and filter manually
    if (databaseTasks.length === 0) {
      try {
        const result = await getNotionPagesController(
          notionClient,
          selectedDb.database_id,
          undefined,
          undefined,
          true,
          user.id
        )
        if (result.data) {
          // Filter for tasks that might be in progress (check status property)
          databaseTasks = result.data.filter((task: any) => {
            const status = task.accomplishmentType?.toLowerCase() || ''
            return (
              status.includes('progress') ||
              status.includes('doing') ||
              status.includes('active') ||
              status.includes('wip')
            )
          })
        }
      } catch (err) {
        console.error(
          `[Chief of Staff] Error fetching tasks from database ${selectedDb.database_id}:`,
          err
        )
        // Continue to next database
        continue
      }
    }

    // Add database title to tasks for context
    databaseTasks = databaseTasks.map((task) => ({
      ...task,
      database_title: selectedDb.database_title || 'Untitled Database',
    }))

    allTasks = allTasks.concat(databaseTasks)
  }

  const tasks = allTasks

  // Format task summary
  let summaryMessage = ''
  if (tasks.length === 0) {
    summaryMessage = "You don't have any tasks in progress right now. Great job! 🎉"
  } else {
    summaryMessage = `📋 Chief of Staff - Morning Outlook\n\nYou have ${tasks.length} task${
      tasks.length === 1 ? '' : 's'
    } in progress:\n\n`

    // Group tasks by database if multiple databases
    const databasesCount = new Set(tasks.map((t) => t.database_title)).size
    if (databasesCount > 1) {
      // Group by database
      const tasksByDatabase = tasks.reduce((acc, task) => {
        const dbTitle = task.database_title || 'Untitled Database'
        if (!acc[dbTitle]) {
          acc[dbTitle] = []
        }
        acc[dbTitle].push(task)
        return acc
      }, {} as Record<string, typeof tasks>)

      let taskIndex = 1
      for (const [dbTitle, dbTasks] of Object.entries(tasksByDatabase)) {
        summaryMessage += `${dbTitle}:\n`
        const typedDbTasks = dbTasks as typeof tasks
        typedDbTasks.slice(0, 10).forEach((task) => {
          const title = task.title || 'Untitled Task'
          summaryMessage += `  ${taskIndex}. ${title}\n`
          taskIndex++
        })
        if (typedDbTasks.length > 10) {
          summaryMessage += `  ...and ${typedDbTasks.length - 10} more\n`
        }
        summaryMessage += '\n'
      }
    } else {
      // Single database or no database info - simple list
      tasks.slice(0, 10).forEach((task, index) => {
        const title = task.title || 'Untitled Task'
        summaryMessage += `${index + 1}. ${title}\n`
      })
      if (tasks.length > 10) {
        summaryMessage += `\n...and ${tasks.length - 10} more task${
          tasks.length - 10 === 1 ? '' : 's'
        }`
      }
    }
  }

  // Final check before sending: verify we haven't already sent a reply
  // This is a last-ditch check to prevent duplicate sends
  if (messageDbId) {
    const { data: finalCheck } = await supabase
      .from('inbound_messages')
      .select('raw_payload')
      .eq('id', messageDbId)
      .single()

    if (finalCheck?.raw_payload?.chief_of_staff_reply_sent) {
      console.log(`[Chief of Staff] Reply already sent for message ${messageDbId}, skipping send`)
      return
    }
  }

  // Send SMS reply
  try {
    console.log(
      `[Chief of Staff] Sending task summary to ${senderPhone} for message ${messageDbId}`
    )
    await sendPingramSms({
      type: 'workpace_apps',
      to: {
        id: user.email || user.id,
        number: senderPhone,
      },
      sms: { message: summaryMessage },
      metadata: {
        type: 'chief_of_staff_task_summary',
        user_id: user.id,
        task_count: tasks.length,
      },
    })
    console.log(`[Chief of Staff] Successfully sent task summary to ${senderPhone}`)

    // Mark message as having reply sent to prevent duplicate processing
    // Use atomic update with check to ensure only one instance marks it as sent
    if (messageDbId) {
      const { data: currentMessage } = await supabase
        .from('inbound_messages')
        .select('raw_payload')
        .eq('id', messageDbId)
        .single()

      // Only update if reply hasn't been sent yet (double-check)
      if (!currentMessage?.raw_payload?.chief_of_staff_reply_sent) {
        await supabase
          .from('inbound_messages')
          .update({
            raw_payload: {
              ...(currentMessage?.raw_payload || {}),
              chief_of_staff_reply_sent: true,
              chief_of_staff_reply_sent_at: new Date().toISOString(),
              chief_of_staff_processing: false,
            },
          })
          .eq('id', messageDbId)
        console.log(`[Chief of Staff] Marked message ${messageDbId} as reply sent`)
      } else {
        console.log(
          `[Chief of Staff] WARNING: Message ${messageDbId} was already marked as reply sent, but we just sent again!`
        )
      }
    }
  } catch (smsError) {
    console.error('[Chief of Staff] Error sending SMS reply:', smsError)
    // Clear processing flag on error so it can be retried
    if (messageDbId) {
      await supabase
        .from('inbound_messages')
        .update({
          raw_payload: {
            ...((
              await supabase
                .from('inbound_messages')
                .select('raw_payload')
                .eq('id', messageDbId)
                .single()
            ).data?.raw_payload || {}),
            chief_of_staff_processing: false,
          },
        })
        .eq('id', messageDbId)
    }
  }
}

export default apiRequestWrapper({
  [HttpMethod.POST]: webhookController,
})
