import * as slackProvider from './slack'
import * as pingramProvider from './pingram'
import { FeatureFlagsService } from '@/apis/controllers/feature-flags/feature-flags.service'

let cachedUseSlack: boolean | null = null
let cacheTimestamp = 0
const CACHE_TTL_MS = 30_000

async function isSlackEnabled(): Promise<boolean> {
  const now = Date.now()
  if (cachedUseSlack !== null && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedUseSlack
  }

  const flag = await FeatureFlagsService.getByKey('use-slack-notifications')
  cachedUseSlack = flag?.enabled ?? false
  cacheTimestamp = now
  return cachedUseSlack
}

export async function sendAdminSms(message: string) {
  return (await isSlackEnabled())
    ? slackProvider.sendAdminSms(message)
    : pingramProvider.sendAdminSms(message)
}

export async function sendAdminEmail(message: string) {
  return (await isSlackEnabled())
    ? slackProvider.sendAdminEmail(message)
    : pingramProvider.sendAdminEmail(message)
}

export async function sendClientSms(phone: string, message: string) {
  return (await isSlackEnabled())
    ? slackProvider.sendClientSms(phone, message)
    : pingramProvider.sendClientSms(phone, message)
}

export async function sendClientEmail(email: string, phone: string, message: string) {
  return (await isSlackEnabled())
    ? slackProvider.sendClientEmail(email, phone, message)
    : pingramProvider.sendClientEmail(email, phone, message)
}
