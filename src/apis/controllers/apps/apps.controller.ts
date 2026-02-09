import { HttpResponse } from '@/server/types'

import { AppsService } from './apps.service'
import { App } from './apps.types'

export const getAppsController = async (): Promise<HttpResponse<App[]>> => {
  try {
    const apps = await AppsService.getApps()
    return {
      data: apps,
      status: 200,
    }
  } catch (error) {
    console.error('[getAppsController] Error:', error)
    return {
      data: [],
      status: 500,
    }
  }
}
