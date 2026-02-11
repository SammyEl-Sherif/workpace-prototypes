import { querySupabase } from '@/db'
import { GoodThingMedia } from '@/interfaces/good-things'

export const GoodThingMediaService = {
  async getByGoodThingId(goodThingId: string, userId: string): Promise<GoodThingMedia[]> {
    return querySupabase<GoodThingMedia>('good_thing_media/get_by_good_thing_id.sql', [
      goodThingId,
      userId,
    ])
  },

  async create(
    goodThingId: string,
    userId: string,
    input: {
      file_name: string
      storage_path: string
      media_type: 'photo' | 'video'
      media_url: string
      thumbnail_url?: string | null
      file_size_bytes?: number | null
      mime_type?: string | null
    }
  ): Promise<GoodThingMedia> {
    const results = await querySupabase<GoodThingMedia>('good_thing_media/create.sql', [
      goodThingId,
      userId,
      input.file_name,
      input.storage_path,
      input.media_type,
      input.media_url,
      input.thumbnail_url || null,
      input.file_size_bytes || null,
      input.mime_type || null,
    ])

    if (results.length === 0) {
      throw new Error('Failed to create media record')
    }

    return results[0]
  },

  async delete(id: string, userId: string): Promise<void> {
    const results = await querySupabase<GoodThingMedia>('good_thing_media/delete.sql', [id, userId])

    if (results.length === 0) {
      throw new Error('Media not found or you do not have permission to delete it')
    }
  },

  async getByUserDateRange(userId: string, startDate: string, endDate: string): Promise<any[]> {
    return querySupabase('good_thing_media/get_by_user_date_range.sql', [
      userId,
      startDate,
      endDate,
    ])
  },

  async getByGoodThingIds(goodThingIds: string[], userId: string): Promise<GoodThingMedia[]> {
    if (goodThingIds.length === 0) {
      return []
    }
    return querySupabase<GoodThingMedia>('good_thing_media/get_by_good_thing_ids.sql', [
      goodThingIds,
      userId,
    ])
  },
}
