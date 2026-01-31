import { querySupabase } from '@/db'

import { Prototype } from './prototypes.types'

export const PrototypesService = {
  async getPrototypes(): Promise<Prototype[]> {
    const prototypes = await querySupabase<Prototype>('prototypes/get_all.sql', [])
    return prototypes
  },
}
