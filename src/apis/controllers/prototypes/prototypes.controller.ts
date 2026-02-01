import { HttpResponse } from '@/server/types'

import { PrototypesService } from './prototypes.service'
import { Prototype } from './prototypes.types'

export const getPrototypesController = async (): Promise<HttpResponse<Prototype[]>> => {
  try {
    const prototypes = await PrototypesService.getPrototypes()
    return {
      data: prototypes,
      status: 200,
    }
  } catch (error) {
    console.error('[getPrototypesController] Error:', error)
    return {
      data: [],
      status: 500,
    }
  }
}
