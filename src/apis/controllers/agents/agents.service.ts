import { querySupabase } from '@/db'

import { Agent } from './agents.types'

export const AgentsService = {
  async getPublishedAgents(): Promise<Agent[]> {
    const agents = await querySupabase<Agent>('agents/get_published.sql', [])
    return agents
  },
}
