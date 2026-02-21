import { querySupabase } from '@/db'

export async function logAuditEvent(
  threadId: string,
  nodeName: string,
  eventType: string,
  actor = 'system',
  payload: Record<string, unknown> = {}
) {
  try {
    await querySupabase('pipeline_audit_log/create.sql', [
      threadId,
      nodeName,
      eventType,
      actor,
      JSON.stringify(payload),
    ])
  } catch (error) {
    console.error('[Pipeline Audit] Failed to log event:', error)
  }
}

export async function getAuditLog(threadId: string) {
  return querySupabase('pipeline_audit_log/get_by_thread.sql', [threadId])
}
