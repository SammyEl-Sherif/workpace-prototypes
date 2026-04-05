import { HttpResponse } from '@/server/types'

import { AgentsService } from './agents.service'
import { Agent } from './agents.types'

export const getAgentsController = async (): Promise<HttpResponse<Agent[]>> => {
  try {
    const agents = await AgentsService.getPublishedAgents()
    return {
      data: agents,
      status: 200,
    }
  } catch (error) {
    console.error('[getAgentsController] Error:', error)
    return {
      data: [],
      status: 500,
    }
  }
}
