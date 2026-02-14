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

    // If this good_thing is linked to a challenge, also create challenge_evidence
    try {
      const { GoodThingsService } = await import(
        '@/apis/controllers/good-things/good-things.service'
      )
      const goodThing = await GoodThingsService.getById(goodThingId, userId)

      if (goodThing?.challenge_id && goodThing.completion_date) {
        const { ChallengesService } = await import(
          '@/apis/controllers/challenges/challenges.service'
        )
        // Verify user is a participant
        const participants = await ChallengesService.getParticipants(goodThing.challenge_id)
        const isParticipant = participants.some((p) => p.user_id === userId)

        if (isParticipant) {
          // Create challenge_evidence record using the same media
          await ChallengesService.createEvidence(userId, {
            challenge_id: goodThing.challenge_id,
            evidence_date: goodThing.completion_date,
            file_name: input.file_name,
            storage_path: input.storage_path,
            media_type: input.media_type,
            media_url: input.media_url,
            thumbnail_url: input.thumbnail_url,
            file_size_bytes: input.file_size_bytes,
            mime_type: input.mime_type,
            notes: goodThing.description || null,
          })
        }
      }
    } catch (error) {
      // Log but don't fail media creation
      console.error('Failed to create challenge evidence for media:', error)
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
