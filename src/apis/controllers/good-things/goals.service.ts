import { querySupabase } from '@/db'
import { Goal, CreateGoalInput, UpdateGoalInput } from '@/interfaces/good-things'

export const GoalsService = {
  async getAll(userId: string): Promise<Goal[]> {
    return querySupabase<Goal>('goals/get_all.sql', [userId])
  },

  async getById(id: string, userId: string): Promise<Goal | null> {
    const results = await querySupabase<Goal>('goals/get_by_id.sql', [id, userId])
    return results[0] || null
  },

  async create(userId: string, input: CreateGoalInput): Promise<Goal> {
    if (!input.name || input.name.trim() === '') {
      throw new Error('Goal name is required')
    }

    const results = await querySupabase<Goal>('goals/create.sql', [userId, input.name.trim()])

    if (results.length === 0) {
      throw new Error('Failed to create goal')
    }

    return results[0]
  },

  async update(id: string, userId: string, input: UpdateGoalInput): Promise<Goal> {
    if (!input.name || input.name.trim() === '') {
      throw new Error('Goal name is required')
    }

    const results = await querySupabase<Goal>('goals/update.sql', [
      id,
      userId,
      input.name.trim(),
    ])

    if (results.length === 0) {
      throw new Error('Goal not found or you do not have permission to update it')
    }

    return results[0]
  },

  async delete(id: string, userId: string): Promise<void> {
    const results = await querySupabase<Goal>('goals/delete.sql', [id, userId])

    if (results.length === 0) {
      throw new Error('Goal not found or you do not have permission to delete it')
    }
  },
}
