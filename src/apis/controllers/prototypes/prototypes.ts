import { PrototypesService } from '@/services/prototypes/prototypes.service'
import { HttpResponse } from '@/server/types'

export const getPrototypesController = async (): Promise<HttpResponse<unknown[]>> => {
  try {
    const prototypes = await PrototypesService.getPrototypes()
    return {
      data: prototypes,
      status: 200,
    }
  } catch (error: any) {
    return {
      data: [],
      status: error.statusCode || 500,
    }
  }
}
