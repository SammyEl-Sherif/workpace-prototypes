import { WebClient } from '@slack/web-api'

const slack = new WebClient(process.env.SLACK_BOT_TOKEN)

const ADMIN_CHANNEL = process.env.SLACK_ADMIN_CHANNEL ?? ''
const CLIENT_CHANNEL = process.env.SLACK_CLIENT_CHANNEL ?? ''

export async function sendAdminSms(message: string) {
  if (!ADMIN_CHANNEL) {
    console.warn('[Pipeline] SLACK_ADMIN_CHANNEL not set — skipping admin Slack message')
    return
  }

  return slack.chat.postMessage({
    channel: ADMIN_CHANNEL,
    text: message,
  })
}

export async function sendAdminEmail(message: string) {
  if (!ADMIN_CHANNEL) {
    console.warn('[Pipeline] SLACK_ADMIN_CHANNEL not set — skipping admin Slack message')
    return
  }

  return slack.chat.postMessage({
    channel: ADMIN_CHANNEL,
    text: message,
  })
}

export async function sendClientSms(phone: string, message: string) {
  if (!CLIENT_CHANNEL) {
    console.warn('[Pipeline] SLACK_CLIENT_CHANNEL not set — skipping client Slack message')
    return
  }

  return slack.chat.postMessage({
    channel: CLIENT_CHANNEL,
    text: `[Client: ${phone}] ${message}`,
  })
}

export async function sendClientEmail(email: string, phone: string, message: string) {
  if (!CLIENT_CHANNEL) {
    console.warn('[Pipeline] SLACK_CLIENT_CHANNEL not set — skipping client Slack message')
    return
  }

  return slack.chat.postMessage({
    channel: CLIENT_CHANNEL,
    text: `[Client: ${email}] ${message}`,
  })
}
