import { querySupabase } from '@/db'
import {
  Challenge,
  CreateChallengeInput,
  UpdateChallengeInput,
  ChallengeParticipant,
  ChallengeInvitation,
  ChallengeEvidence,
  CreateChallengeInvitationInput,
  UpdateChallengeInvitationInput,
  CreateChallengeEvidenceInput,
} from '@/interfaces/challenges'

export const ChallengesService = {
  async getAll(userId: string): Promise<Challenge[]> {
    return querySupabase<Challenge>('challenges/get_all.sql', [userId])
  },

  async getById(id: string, userId: string): Promise<Challenge | null> {
    const results = await querySupabase<Challenge>('challenges/get_by_id.sql', [id, userId])
    return results[0] || null
  },

  async create(userId: string, input: CreateChallengeInput): Promise<Challenge> {
    if (!input.name || input.name.trim() === '') {
      throw new Error('Challenge name is required')
    }

    if (!input.task_description || input.task_description.trim() === '') {
      throw new Error('Task description is required')
    }

    if (!input.duration_days || input.duration_days <= 0) {
      throw new Error('Duration must be greater than 0')
    }

    // Validate goal_id
    const { querySupabase: querySupabaseForValidation } = await import('@/db')
    const goalResults = await querySupabaseForValidation<{ id: string }>('goals/get_by_id.sql', [
      input.goal_id,
      userId,
    ])
    if (goalResults.length === 0) {
      throw new Error('Goal not found or you do not have permission to use it')
    }

    // Validate dates
    const startDate = new Date(input.start_date)
    const endDate = new Date(input.end_date)
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error('Invalid date format')
    }
    if (endDate < startDate) {
      throw new Error('End date must be after start date')
    }

    const results = await querySupabase<Challenge>('challenges/create.sql', [
      userId,
      input.goal_id,
      input.name.trim(),
      input.description?.trim() || null,
      input.duration_days,
      input.task_description.trim(),
      input.start_date,
      input.end_date,
    ])

    if (results.length === 0) {
      throw new Error('Failed to create challenge')
    }

    // Automatically add creator as participant
    await this.addParticipant(results[0].id, userId)

    // Fetch with goal name
    return this.getById(results[0].id, userId) as Promise<Challenge>
  },

  async update(id: string, userId: string, input: UpdateChallengeInput): Promise<Challenge> {
    const results = await querySupabase<Challenge>('challenges/update.sql', [
      id,
      userId,
      input.name?.trim() || null,
      input.description?.trim() || null,
      input.task_description?.trim() || null,
    ])

    if (results.length === 0) {
      throw new Error('Challenge not found or you do not have permission to update it')
    }

    return this.getById(id, userId) as Promise<Challenge>
  },

  async delete(id: string, userId: string): Promise<void> {
    const results = await querySupabase<Challenge>('challenges/delete.sql', [id, userId])

    if (results.length === 0) {
      throw new Error('Challenge not found or you do not have permission to delete it')
    }
  },

  async getParticipants(challengeId: string): Promise<ChallengeParticipant[]> {
    const participants = await querySupabase<ChallengeParticipant>(
      'challenge_participants/get_by_challenge_id.sql',
      [challengeId]
    )

    // Fetch user details for each participant
    const supabaseUrl = process.env.NEXT_PUBLIC_WORKPACE_SUPABASE_URL
    const supabaseServiceRoleKey = process.env.WORKPACE_SUPABASE_SERVICE_ROLE_KEY?.trim()

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      // Return participants without user details if Supabase config is missing
      return participants
    }

    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

    const participantsWithUsers: ChallengeParticipant[] = []

    for (const participant of participants) {
      try {
        const { data: userData, error } = await supabase.auth.admin.getUserById(participant.user_id)
        if (error || !userData) {
          console.error(`Failed to fetch user ${participant.user_id}:`, error)
          // Still include participant with email if available
          participantsWithUsers.push({
            ...participant,
            user_email: participant.user_email || null,
            user_name: participant.user_name || null,
          })
          continue
        }

        participantsWithUsers.push({
          ...participant,
          user_email: userData.user.email || null,
          user_name: userData.user.user_metadata?.name || userData.user.email || null,
        })
      } catch (error) {
        console.error(`Error fetching user ${participant.user_id}:`, error)
        // Still include participant
        participantsWithUsers.push({
          ...participant,
          user_email: participant.user_email || null,
          user_name: participant.user_name || null,
        })
      }
    }

    return participantsWithUsers
  },

  async addParticipant(challengeId: string, userId: string): Promise<ChallengeParticipant | null> {
    const results = await querySupabase<ChallengeParticipant>('challenge_participants/create.sql', [
      challengeId,
      userId,
    ])
    return results[0] || null
  },

  async createInvitation(
    userId: string,
    input: CreateChallengeInvitationInput
  ): Promise<ChallengeInvitation> {
    // Verify user is a participant in the challenge
    const challenge = await this.getById(input.challenge_id, userId)
    if (!challenge) {
      throw new Error('Challenge not found or you are not a participant')
    }

    const results = await querySupabase<ChallengeInvitation>('challenge_invitations/create.sql', [
      input.challenge_id,
      userId,
      input.invitee_user_id,
    ])

    if (results.length === 0) {
      throw new Error('Failed to create invitation (may already exist)')
    }

    return results[0]
  },

  async getInvitationsForUser(userId: string): Promise<ChallengeInvitation[]> {
    return querySupabase<ChallengeInvitation>('challenge_invitations/get_by_invitee.sql', [userId])
  },

  async updateInvitationStatus(
    invitationId: string,
    userId: string,
    input: UpdateChallengeInvitationInput
  ): Promise<ChallengeInvitation> {
    const results = await querySupabase<ChallengeInvitation>(
      'challenge_invitations/update_status.sql',
      [invitationId, userId, input.status]
    )

    if (results.length === 0) {
      throw new Error('Invitation not found or you do not have permission to update it')
    }

    // If accepted, add user as participant
    if (input.status === 'accepted') {
      const invitation = results[0]
      await this.addParticipant(invitation.challenge_id, userId)
    }

    return results[0]
  },

  async getEvidence(challengeId: string, userId?: string): Promise<ChallengeEvidence[]> {
    if (userId) {
      return querySupabase<ChallengeEvidence>('challenge_evidence/get_by_challenge_and_user.sql', [
        challengeId,
        userId,
      ])
    }
    return querySupabase<ChallengeEvidence>('challenge_evidence/get_by_challenge.sql', [
      challengeId,
    ])
  },

  async createEvidence(
    userId: string,
    input: CreateChallengeEvidenceInput
  ): Promise<ChallengeEvidence> {
    // Verify user is a participant
    const participants = await this.getParticipants(input.challenge_id)
    const isParticipant = participants.some((p) => p.user_id === userId)
    if (!isParticipant) {
      throw new Error('You must be a participant in this challenge to upload evidence')
    }

    const results = await querySupabase<ChallengeEvidence>('challenge_evidence/create.sql', [
      input.challenge_id,
      userId,
      input.evidence_date,
      input.file_name,
      input.storage_path,
      input.media_type,
      input.media_url,
      input.thumbnail_url || null,
      input.file_size_bytes || null,
      input.mime_type || null,
      input.notes || null,
    ])

    if (results.length === 0) {
      throw new Error('Failed to create evidence')
    }

    return results[0]
  },

  async deleteEvidence(evidenceId: string, userId: string): Promise<void> {
    const results = await querySupabase<ChallengeEvidence>('challenge_evidence/delete.sql', [
      evidenceId,
      userId,
    ])

    if (results.length === 0) {
      throw new Error('Evidence not found or you do not have permission to delete it')
    }
  },
}
