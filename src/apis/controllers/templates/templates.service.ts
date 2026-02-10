import { querySupabase } from '@/db'

import { NotionTemplate } from './templates.types'

export const TemplatesService = {
  async getPublishedTemplates(): Promise<NotionTemplate[]> {
    const templates = await querySupabase<NotionTemplate>('notion_templates/get_published.sql', [])
    return templates
  },
}
