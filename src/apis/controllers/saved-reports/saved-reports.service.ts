import { querySupabase } from '@/db'
import {
  SavedReport,
  CreateSavedReportInput,
  UpdateSavedReportInput,
} from '@/interfaces/saved-reports'

export const SavedReportsService = {
  async getAll(userId: string): Promise<SavedReport[]> {
    return querySupabase<SavedReport>('saved_reports/get_all.sql', [userId])
  },

  async getById(id: string, userId: string): Promise<SavedReport | null> {
    const results = await querySupabase<SavedReport>('saved_reports/get_by_id.sql', [id, userId])
    return results[0] || null
  },

  async create(userId: string, input: CreateSavedReportInput): Promise<SavedReport> {
    if (!input.title || input.title.trim() === '') {
      throw new Error('Title is required')
    }

    if (!input.content || input.content.trim() === '') {
      throw new Error('Content is required')
    }

    const format = input.format || 'markdown'

    const results = await querySupabase<SavedReport>('saved_reports/create.sql', [
      userId,
      input.title.trim(),
      input.content.trim(),
      format,
      input.prompt_used?.trim() || null,
    ])

    if (results.length === 0) {
      throw new Error('Failed to create saved report')
    }

    return results[0]
  },

  async update(id: string, userId: string, input: UpdateSavedReportInput): Promise<SavedReport> {
    const existing = await this.getById(id, userId)
    if (!existing) {
      throw new Error('Saved report not found or you do not have permission to update it')
    }

    const title = input.title?.trim() || existing.title
    const content = input.content?.trim() || existing.content
    const format = input.format || existing.format
    const prompt_used =
      input.prompt_used !== undefined ? input.prompt_used?.trim() || null : existing.prompt_used

    if (!title || title === '') {
      throw new Error('Title is required')
    }

    if (!content || content === '') {
      throw new Error('Content is required')
    }

    const results = await querySupabase<SavedReport>('saved_reports/update.sql', [
      id,
      userId,
      title,
      content,
      format,
      prompt_used,
    ])

    if (results.length === 0) {
      throw new Error('Failed to update saved report')
    }

    return results[0]
  },

  async delete(id: string, userId: string): Promise<void> {
    const results = await querySupabase<SavedReport>('saved_reports/delete.sql', [id, userId])

    if (results.length === 0) {
      throw new Error('Saved report not found or you do not have permission to delete it')
    }
  },
}
