import { querySupabase } from '@/db'
import {
  GoodThing,
  CreateGoodThingInput,
  UpdateGoodThingInput,
} from '@/interfaces/good-things'

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
      const goalResults = await querySupabaseForValidation<{ id: string }>(
        'goals/get_by_id.sql',
        [input.goal_id, userId]
      )
      if (goalResults.length === 0) {
        throw new Error('Goal not found or you do not have permission to use it')
      }
    }

    const results = await querySupabase<GoodThing>('good_things/create.sql', [
      userId,
      input.goal_id || null,
      input.title.trim(),
      input.description?.trim() || null,
      input.completion_date || null,
    ])

    if (results.length === 0) {
      throw new Error('Failed to create good thing')
    }

    // Fetch with goal name
    return this.getById(results[0].id, userId) as Promise<GoodThing>
  },

  async update(
    id: string,
    userId: string,
    input: UpdateGoodThingInput
  ): Promise<GoodThing> {
    if (!input.title || input.title.trim() === '') {
      throw new Error('Title is required')
    }

    // Validate goal_id if provided
    if (input.goal_id) {
      const { querySupabase: querySupabaseForValidation } = await import('@/db')
      const goalResults = await querySupabaseForValidation<{ id: string }>(
        'goals/get_by_id.sql',
        [input.goal_id, userId]
      )
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
}
