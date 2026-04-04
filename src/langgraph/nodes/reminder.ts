import { PipelineState } from '../state'
import { sendClientSms, sendClientEmail, sendAdminSms } from '../integrations/notifications'
import { logAuditEvent } from '../utils/audit'
import { TIMEOUT_CONFIG } from '../utils/reminders'

export async function sendReminder(state: PipelineState): Promise<Partial<PipelineState>> {
  const newReminderCount = (state.reminderCount || 0) + 1
  const stage = state.status

  let maxReminders = 2
  if (stage === 'awaiting_signature') {
    maxReminders = TIMEOUT_CONFIG.MAX_REMINDERS.contract
  } else if (stage === 'intake_pending') {
    maxReminders = TIMEOUT_CONFIG.MAX_REMINDERS.intake
  } else {
    maxReminders = TIMEOUT_CONFIG.MAX_REMINDERS.portal
  }

  if (newReminderCount > maxReminders) {
    await sendAdminSms(
      `Max reminders reached for ${state.clientName} (${stage}). Manual follow-up needed.`
    )

    await logAuditEvent(state.notionPageId, 'sendReminder', 'max_reminders_reached', 'system', {
      reminderCount: newReminderCount,
      stage,
    })

    return {
      reminderCount: newReminderCount,
      lastActivity: new Date().toISOString(),
    }
  }

  await sendClientSms(
    state.clientPhone,
    `Hi ${state.clientName}, just following up! We'd love to keep things moving. Please let us know if you have any questions.`
  )

  await sendClientEmail(
    state.clientEmail,
    state.clientPhone,
    `Hi ${state.clientName}, this is a friendly follow-up. We want to make sure you have everything you need. Please don't hesitate to reach out with any questions.`
  )

  await logAuditEvent(state.notionPageId, 'sendReminder', 'reminder_sent', 'system', {
    reminderCount: newReminderCount,
    stage,
  })

  return {
    reminderCount: newReminderCount,
    lastActivity: new Date().toISOString(),
  }
}
