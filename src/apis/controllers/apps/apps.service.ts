import { querySupabase } from '@/db'

import { App } from './apps.types'

export const AppsService = {
  async getApps(): Promise<App[]> {
    const apps = await querySupabase<App>('apps/get_all.sql', [])
    return apps
  },
}
