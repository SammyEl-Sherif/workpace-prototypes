import PocketBase from 'pocketbase'

import { ProjectsRecord } from '@/pocketbase-types'
import { HttpResponse } from '@/server/types'

export const getProjectsController = async (
  pbClient: PocketBase
): Promise<HttpResponse<ProjectsRecord[] | null>> => {
  try {
    const records: ProjectsRecord[] = await pbClient.collection('projects').getFullList({
      sort: '-title',
    })
    return {
      data: records ?? null,
      status: 200,
    }
  } catch (error) {
    return {
      data: null,
      status: 500,
    }
  }
}
