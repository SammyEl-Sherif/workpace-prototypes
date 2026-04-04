import { querySupabase } from '@/db'
import { ChangeRequest, CreateChangeRequestInput } from '@/interfaces/portal'

export const ChangeRequestsService = {
  async getByOrgId(orgId: string): Promise<ChangeRequest[]> {
    return querySupabase<ChangeRequest>('change_requests/get_by_org_id.sql', [orgId])
  },

  async getById(id: string): Promise<ChangeRequest | null> {
    const results = await querySupabase<ChangeRequest>('change_requests/get_by_id.sql', [id])
    return results.length > 0 ? results[0] : null
  },

  async create(
    orgId: string,
    userId: string,
    input: CreateChangeRequestInput
  ): Promise<ChangeRequest> {
    const results = await querySupabase<ChangeRequest>('change_requests/create.sql', [
      orgId,
      userId,
      input.title,
      input.description,
      input.category,
      input.priority,
    ])
    if (results.length === 0) {
      throw new Error('Failed to create change request')
    }
    return results[0]
  },
}
