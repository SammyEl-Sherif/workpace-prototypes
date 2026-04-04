import { querySupabase } from '@/db'
import { createGraph } from '@/langgraph/graph'
import { Command } from '@langchain/langgraph'

// Timeout configuration
export const TIMEOUT_CONFIG = {
  PORTAL_SIGNUP_HOURS: 48,
  INTAKE_SUBMIT_HOURS: 72,
  CONTRACT_SIGN_BUSINESS_DAYS: 5,
  MAX_REMINDERS: {
    portal: 2,
    intake: 2,
    contract: 3,
  },
} as const

export async function checkTimeouts() {
  const threads = await querySupabase<{
    thread_id: string
    status: string
    updated_at: string
  }>('pipeline_threads/get_active.sql', [])

  const now = Date.now()
  const graph = await createGraph()

  for (const thread of threads) {
    const lastUpdate = new Date(thread.updated_at).getTime()
    const hoursSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60)

    let shouldRemind = false

    if (thread.status === 'active' && hoursSinceUpdate > TIMEOUT_CONFIG.PORTAL_SIGNUP_HOURS) {
      shouldRemind = true
    } else if (
      thread.status === 'active' &&
      hoursSinceUpdate > TIMEOUT_CONFIG.INTAKE_SUBMIT_HOURS
    ) {
      shouldRemind = true
    }

    if (shouldRemind) {
      try {
        await graph.invoke(new Command({ resume: { action: 'send_reminder' } }), {
          configurable: { thread_id: thread.thread_id },
        })
      } catch (error) {
        console.error(
          `[Pipeline Reminders] Failed to send reminder for thread ${thread.thread_id}:`,
          error
        )
      }
    }
  }
}
