import { querySupabase } from '@/db'
import { GoodThing, CreateGoodThingInput, UpdateGoodThingInput } from '@/interfaces/good-things'

export const GoodThingsService = {
  async getAll(userId: string): Promise<GoodThing[]> {
    return querySupabase<GoodThing>('good_things/get_all.sql', [userId])
  },

  async getById(id: string, userId: string): Promise<GoodThing | null> {
    const results = await querySupabase<GoodThing>('good_things/get_by_id.sql', [id, userId])
    return results[0] || null
  },

  async create(userId: string, input: CreateGoodThingInput): Promise<GoodThing> {
    if (!input.title || input.title.trim() === '') {
      throw new Error('Title is required')
    }

    // Validate goal_id if provided
    if (input.goal_id) {
      // Verify the goal belongs to the user
      const { querySupabase: querySupabaseForValidation } = await import('@/db')
      const goalResults = await querySupabaseForValidation<{ id: string }>('goals/get_by_id.sql', [
        input.goal_id,
        userId,
      ])
      if (goalResults.length === 0) {
        throw new Error('Goal not found or you do not have permission to use it')
      }
    }

    // Validate challenge_id if provided
    if (input.challenge_id) {
      try {
        const { ChallengesService } = await import(
          '@/apis/controllers/challenges/challenges.service'
        )
        // Verify user is a participant in the challenge
        const participants = await ChallengesService.getParticipants(input.challenge_id)
        const isParticipant = participants.some((p) => p.user_id === userId)
        if (!isParticipant) {
          throw new Error(
            'You must be a participant in this challenge to create achievements for it'
          )
        }
      } catch (error) {
        if (error instanceof Error && error.message.includes('participant')) {
          throw error
        }
        // If challenge doesn't exist or other error, log but don't fail
        console.error('Error validating challenge_id:', error)
        throw new Error('Challenge not found or you do not have permission to use it')
      }
    }

    let results: GoodThing[]
    try {
      results = await querySupabase<GoodThing>('good_things/create.sql', [
        userId,
        input.goal_id || null,
        input.challenge_id || null,
        input.title.trim(),
        input.description?.trim() || null,
        input.completion_date || null,
      ])

      if (results.length === 0) {
        throw new Error('Failed to create good thing')
      }
    } catch (error: any) {
      console.error('[GoodThingsService.create] SQL Error:', error)
      // Check if it's a column doesn't exist error
      if (error?.message?.includes('challenge_id') || error?.message?.includes('column')) {
        throw new Error(
          'Database schema is out of date. Please run migrations: npm run supabase:push'
        )
      }
      throw error
    }

    const goodThing = results[0]

    // If challenge_id is present, create challenge_evidence records for any media
    // Note: Media is created separately via good-thing-media API, so we'll handle
    // challenge_evidence creation in the media service or via a trigger
    // For now, we'll create a basic evidence record if completion_date is set
    if (input.challenge_id && input.completion_date) {
      try {
        const { ChallengesService } = await import(
          '@/apis/controllers/challenges/challenges.service'
        )
        // Verify user is a participant
        const participants = await ChallengesService.getParticipants(input.challenge_id)
        const isParticipant = participants.some((p) => p.user_id === userId)

        if (isParticipant) {
          // Create a challenge_evidence record (media will be linked separately)
          // We'll create a placeholder evidence record that can be updated when media is added
          // For now, skip creating evidence here - it will be created when media is uploaded
        }
      } catch (error) {
        // Log but don't fail good_thing creation
        console.error('Failed to create challenge evidence for good_thing:', error)
      }
    }

    // Fetch with goal name
    return this.getById(goodThing.id, userId) as Promise<GoodThing>
  },

  async update(id: string, userId: string, input: UpdateGoodThingInput): Promise<GoodThing> {
    if (!input.title || input.title.trim() === '') {
      throw new Error('Title is required')
    }

    // Validate goal_id if provided
    if (input.goal_id) {
      const { querySupabase: querySupabaseForValidation } = await import('@/db')
      const goalResults = await querySupabaseForValidation<{ id: string }>('goals/get_by_id.sql', [
        input.goal_id,
        userId,
      ])
      if (goalResults.length === 0) {
        throw new Error('Goal not found or you do not have permission to use it')
      }
    }

    const results = await querySupabase<GoodThing>('good_things/update.sql', [
      id,
      userId,
      input.goal_id || null,
      input.title.trim(),
      input.description?.trim() || null,
      input.completion_date || null,
    ])

    if (results.length === 0) {
      throw new Error('Good thing not found or you do not have permission to update it')
    }

    // Fetch with goal name
    return this.getById(id, userId) as Promise<GoodThing>
  },

  async delete(id: string, userId: string): Promise<void> {
    const results = await querySupabase<GoodThing>('good_things/delete.sql', [id, userId])

    if (results.length === 0) {
      throw new Error('Good thing not found or you do not have permission to delete it')
    }
  },

  async getByDateRange(userId: string, startDate: string, endDate: string): Promise<GoodThing[]> {
    return querySupabase<GoodThing>('good_things/get_by_date_range.sql', [
      userId,
      startDate,
      endDate,
    ])
  },

  async bulkCreate(userId: string, inputs: CreateGoodThingInput[]): Promise<GoodThing[]> {
    const created: GoodThing[] = []

    for (const input of inputs) {
      try {
        const goodThing = await this.create(userId, input)
        created.push(goodThing)
      } catch (error) {
        // Log error but continue with other items
        console.error(`Failed to create good thing: ${input.title}`, error)
      }
    }

    return created
  },
}
