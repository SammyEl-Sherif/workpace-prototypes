import { HttpResponse } from '@/server/types'
import PocketBase from 'pocketbase'

type ProjectListResponse = {}

export const getProjectsController = async (
  pbClient: PocketBase
): Promise<HttpResponse<ProjectListResponse>> => {
  try {
    const records = await pbClient.collection('projects').getFullList({
      sort: '-title',
    })
    return {
      data: { response: records ?? [] },
      status: 200,
    }
  } catch (error) {
    return {
      data: { response: [] },
      status: 500,
    }
  }
}
