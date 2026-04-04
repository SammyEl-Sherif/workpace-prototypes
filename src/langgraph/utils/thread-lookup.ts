import { Command } from '@langchain/langgraph'

import { querySupabase } from '@/db'
import { createGraph } from '@/langgraph/graph'

interface PipelineThread {
  id: string
  thread_id: string
  client_email: string | null
  client_phone: string | null
  org_id: string | null
  envelope_id: string | null
  notion_page_id: string | null
  status: string
  created_at: string
  updated_at: string
}

export async function createThread(data: {
  clientEmail?: string
  clientPhone?: string
  orgId?: string
  envelopeId?: string
  notionPageId?: string
}): Promise<string> {
  const threadId = crypto.randomUUID()

  await querySupabase('pipeline_threads/create.sql', [
    threadId,
    data.clientEmail || null,
    data.clientPhone || null,
    data.orgId || null,
    data.envelopeId || null,
    data.notionPageId || null,
    'active',
  ])

  return threadId
}

export async function findThread(criteria: {
  clientEmail?: string
  orgId?: string
  envelopeId?: string
}): Promise<PipelineThread | null> {
  const rows = await querySupabase<PipelineThread>('pipeline_threads/find_by_criteria.sql', [
    criteria.clientEmail || null,
    criteria.orgId || null,
    criteria.envelopeId || null,
  ])
  return rows[0] || null
}

export async function updateThread(
  threadId: string,
  data: {
    orgId?: string
    envelopeId?: string
    notionPageId?: string
    status?: string
  }
) {
  return querySupabase('pipeline_threads/update.sql', [
    threadId,
    data.orgId || null,
    data.envelopeId || null,
    data.notionPageId || null,
    data.status || null,
  ])
}

export async function getActiveThreads(): Promise<PipelineThread[]> {
  return querySupabase<PipelineThread>('pipeline_threads/get_active.sql', [])
}

export async function resumeThread(
  criteria: { clientEmail?: string; orgId?: string; envelopeId?: string },
  resumeData: Record<string, unknown>
) {
  const thread = await findThread(criteria)
  if (!thread) {
    console.warn('[Pipeline] No active thread found for criteria:', criteria)
    return null
  }

  const graph = await createGraph()

  const result = await graph.invoke(new Command({ resume: resumeData }), {
    configurable: { thread_id: thread.thread_id },
  })

  return result
}
