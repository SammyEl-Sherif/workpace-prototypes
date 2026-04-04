/**
 * Standalone script to test the first step of the pipeline graph.
 *
 * Usage:
 *   cd src && npx tsx langgraph/test-invoke.ts
 *
 * Requires:
 *   - Local Supabase DB running (./scripts/dev.sh db:start)
 *   - .env.local with SUPABASE_DB_URL, NOTION_API_KEY, NOTION_PIPELINE_DB_ID, PINGRAM_API_KEY
 */
import 'dotenv/config'
import { createGraph } from './graph'

async function main() {
  console.log('--- Pipeline Graph Test ---\n')

  // Check required env vars
  const required = ['SUPABASE_DB_URL']
  for (const key of required) {
    if (!process.env[key]) {
      console.error(`Missing env var: ${key}`)
      process.exit(1)
    }
  }

  console.log('Creating graph with PostgresSaver checkpointer...')
  const graph = await createGraph()

  const threadId = crypto.randomUUID()
  console.log(`Thread ID: ${threadId}\n`)

  console.log('Invoking graph (will run createLead → meetingPrep → pause at logMeeting)...\n')

  try {
    const result = await graph.invoke(
      {
        clientName: 'Test Client',
        clientEmail: 'test@example.com',
        clientPhone: '+15551234567',
        source: 'Manual',
        meetingDatetime: '2026-02-20T10:00:00Z',
        status: 'new_lead',
        notionPageId: '',
        meetingNotes: null,
        pricingDiscussed: null,
        portalLink: null,
        portalSignupComplete: false,
        orgId: null,
        intakeFormResponses: null,
        scopeOfWorkDraft: null,
        contractId: null,
        contractEnvelopeId: null,
        contractSigned: false,
        contractSignedUrl: null,
        projectPageId: null,
        reminderCount: 0,
        lastActivity: new Date().toISOString(),
        adminDecision: null,
        error: null,
      },
      { configurable: { thread_id: threadId } }
    )

    console.log('Graph paused (interrupt). Current state:')
    console.log(JSON.stringify(result, null, 2))
  } catch (error: unknown) {
    // GraphInterrupt is expected — the graph pauses at logMeeting
    const err = error as { name?: string; message?: string }
    if (err.name === 'GraphInterrupt') {
      console.log('Graph interrupted at logMeeting (expected!)')

      // Fetch the saved state
      const state = await graph.getState({ configurable: { thread_id: threadId } })
      console.log('\nSaved state:')
      console.log(JSON.stringify(state.values, null, 2))
      console.log('\nNext node(s):', state.next)
      console.log('\nTo resume, run the approve endpoint with:')
      console.log(`  POST /api/pipeline/approve/${threadId}`)
      console.log('  Body: { "action": "interested" }')
    } else {
      console.error('Unexpected error:', error)
    }
  }

  console.log('\n--- Done ---')
  process.exit(0)
}

main()
