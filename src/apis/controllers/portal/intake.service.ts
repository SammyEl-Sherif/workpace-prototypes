import { querySupabase } from '@/db'
import { IntakeSubmission, IntakeSubmissionWithOrg, SaveIntakeInput } from '@/interfaces/portal'

export const IntakeService = {
  async getAllWithOrg(): Promise<IntakeSubmissionWithOrg[]> {
    return querySupabase<IntakeSubmissionWithOrg>('intake_submissions/get_all_with_org.sql', [])
  },

  async markReviewed(id: string): Promise<IntakeSubmission | null> {
    const results = await querySupabase<IntakeSubmission>('intake_submissions/mark_reviewed.sql', [
      id,
    ])
    return results.length > 0 ? results[0] : null
  },

  async getByOrgId(orgId: string): Promise<IntakeSubmission | null> {
    const results = await querySupabase<IntakeSubmission>('intake_submissions/get_by_org_id.sql', [
      orgId,
    ])
    return results.length > 0 ? results[0] : null
  },

  async saveDraft(
    orgId: string,
    userId: string,
    input: SaveIntakeInput
  ): Promise<IntakeSubmission> {
    const existing = await this.getByOrgId(orgId)

    if (existing) {
      const results = await querySupabase<IntakeSubmission>('intake_submissions/update.sql', [
        orgId,
        'draft',
        input.company_info ? JSON.stringify(input.company_info) : null,
        input.tools_tech ? JSON.stringify(input.tools_tech) : null,
        input.goals_needs ? JSON.stringify(input.goals_needs) : null,
      ])
      if (results.length === 0) {
        throw new Error('Failed to update intake submission')
      }
      return results[0]
    }

    const results = await querySupabase<IntakeSubmission>('intake_submissions/create.sql', [
      orgId,
      userId,
      'draft',
      JSON.stringify(input.company_info || {}),
      JSON.stringify(input.tools_tech || {}),
      JSON.stringify(input.goals_needs || {}),
      null,
    ])
    if (results.length === 0) {
      throw new Error('Failed to create intake submission')
    }
    return results[0]
  },

  async submit(orgId: string, userId: string, input: SaveIntakeInput): Promise<IntakeSubmission> {
    const existing = await this.getByOrgId(orgId)

    if (existing) {
      const results = await querySupabase<IntakeSubmission>('intake_submissions/update.sql', [
        orgId,
        'submitted',
        input.company_info ? JSON.stringify(input.company_info) : null,
        input.tools_tech ? JSON.stringify(input.tools_tech) : null,
        input.goals_needs ? JSON.stringify(input.goals_needs) : null,
      ])
      if (results.length === 0) {
        throw new Error('Failed to submit intake')
      }
      return results[0]
    }

    const results = await querySupabase<IntakeSubmission>('intake_submissions/create.sql', [
      orgId,
      userId,
      'submitted',
      JSON.stringify(input.company_info || {}),
      JSON.stringify(input.tools_tech || {}),
      JSON.stringify(input.goals_needs || {}),
      new Date().toISOString(),
    ])
    if (results.length === 0) {
      throw new Error('Failed to create and submit intake')
    }
    return results[0]
  },
}
