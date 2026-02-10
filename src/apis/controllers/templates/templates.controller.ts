import { HttpResponse } from '@/server/types'

import { TemplatesService } from './templates.service'
import { NotionTemplate } from './templates.types'

export const getTemplatesController = async (): Promise<HttpResponse<NotionTemplate[]>> => {
  try {
    const templates = await TemplatesService.getPublishedTemplates()
    return {
      data: templates,
      status: 200,
    }
  } catch (error) {
    console.error('[getTemplatesController] Error:', error)
    return {
      data: [],
      status: 500,
    }
  }
}
