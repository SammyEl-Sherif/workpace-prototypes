import { START, END, StateGraph } from '@langchain/langgraph'
import { PostgresSaver } from '@langchain/langgraph-checkpoint-postgres'

import { PipelineAnnotation } from './state'
import {
  createLead,
  meetingPrep,
  logMeeting,
  sendPortalInvite,
  markLost,
  approveAccount,
  sendIntakeNotification,
  assessNeeds,
  generateContract,
  reviewContract,
  sendContract,
  handleSigned,
} from './nodes'
import { routeAfterMeeting, routeAfterReview } from './routing'

function buildGraph() {
  const graph = new StateGraph(PipelineAnnotation)
    // ── Add Nodes ──
    .addNode('createLead', createLead)
    .addNode('meetingPrep', meetingPrep)
    .addNode('logMeeting', logMeeting)
    .addNode('sendPortalInvite', sendPortalInvite)
    .addNode('markLost', markLost)
    .addNode('approveAccount', approveAccount)
    .addNode('sendIntakeNotification', sendIntakeNotification)
    .addNode('assessNeeds', assessNeeds)
    .addNode('generateContract', generateContract)
    .addNode('reviewContract', reviewContract)
    .addNode('sendContract', sendContract)
    .addNode('handleSigned', handleSigned)
    // ── Edges ──
    .addEdge(START, 'createLead')
    .addEdge('createLead', 'meetingPrep')
    .addEdge('meetingPrep', 'logMeeting')
    .addConditionalEdges('logMeeting', routeAfterMeeting, {
      interested: 'sendPortalInvite',
      not_interested: 'markLost',
    })
    .addEdge('markLost', END)
    .addEdge('sendPortalInvite', 'approveAccount')
    .addEdge('approveAccount', 'sendIntakeNotification')
    .addEdge('sendIntakeNotification', 'assessNeeds')
    .addEdge('assessNeeds', 'generateContract')
    .addEdge('generateContract', 'reviewContract')
    .addConditionalEdges('reviewContract', routeAfterReview, {
      approved: 'sendContract',
      revise: 'assessNeeds',
    })
    .addEdge('sendContract', 'handleSigned')
    .addEdge('handleSigned', END)

  return graph
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let graphInstance: any = null

export async function createGraph() {
  if (graphInstance) return graphInstance

  const checkpointer = PostgresSaver.fromConnString(process.env.SUPABASE_DB_URL!)
  await checkpointer.setup()

  const builder = buildGraph()
  graphInstance = builder.compile({ checkpointer })
  return graphInstance
}
