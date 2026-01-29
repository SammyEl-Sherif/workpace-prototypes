import { querySupabase } from '@/db'

export interface Prototype {
  id: string
  [key: string]: unknown
}

export const PrototypesService = {
  async getPrototypes(): Promise<Prototype[]> {
    return await querySupabase<Prototype>('prototypes/get_prototypes.sql', [])
  },
}
