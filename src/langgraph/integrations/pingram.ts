import { sendPingramSms } from '@/server/utils/pingram'

const ADMIN_PHONE = process.env.ADMIN_PHONE_NUMBER ?? ''
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? ''

export async function sendAdminSms(message: string) {
  if (!ADMIN_PHONE) {
    console.warn('[Pipeline] ADMIN_PHONE_NUMBER not set — skipping admin SMS')
    return
  }

  return sendPingramSms({
    type: 'workpace_pipeline',
    to: { id: ADMIN_EMAIL || 'admin', number: ADMIN_PHONE },
    sms: { message },
  })
}

export async function sendClientSms(phone: string, message: string) {
  if (!phone) {
    console.warn('[Pipeline] No client phone — skipping client SMS')
    return
  }

  return sendPingramSms({
    type: 'workpace_pipeline',
    to: { id: phone, number: phone },
    sms: { message },
  })
}

export async function sendAdminEmail(message: string) {
  if (!ADMIN_PHONE) {
    console.warn('[Pipeline] ADMIN_PHONE_NUMBER not set — skipping admin email')
    return
  }

  return sendPingramSms({
    type: 'workpace_pipeline_email',
    to: { id: ADMIN_EMAIL || 'admin', number: ADMIN_PHONE },
    sms: { message },
  })
}

export async function sendClientEmail(email: string, phone: string, message: string) {
  if (!phone) {
    console.warn('[Pipeline] No client phone for email delivery — skipping')
    return
  }

  return sendPingramSms({
    type: 'workpace_pipeline_email',
    to: { id: email, number: phone },
    sms: { message },
  })
}
