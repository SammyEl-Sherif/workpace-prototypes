export interface Challenge {
  id: string
  creator_user_id: string
  goal_id: string
  name: string
  description: string | null
  duration_days: number
  task_description: string
  start_date: string
  end_date: string
  created_at: string
  updated_at: string
  goal_name?: string | null
  creator_name?: string | null
  participant_count?: number
}

export interface ChallengeParticipant {
  id: string
  challenge_id: string
  user_id: string
  joined_at: string
  created_at: string
  updated_at: string
  user_name?: string | null
  user_email?: string | null
}

export interface ChallengeInvitation {
  id: string
  challenge_id: string
  inviter_user_id: string
  invitee_user_id: string
  status: 'pending' | 'accepted' | 'declined'
  created_at: string
  updated_at: string
  challenge_name?: string | null
  inviter_name?: string | null
  invitee_name?: string | null
}

export interface ChallengeEvidence {
  id: string
  challenge_id: string
  participant_user_id: string
  evidence_date: string
  file_name: string
  storage_path: string
  media_type: 'photo' | 'video'
  media_url: string
  thumbnail_url: string | null
  file_size_bytes: number | null
  mime_type: string | null
  notes: string | null
  created_at: string
  participant_name?: string | null
}

export interface CreateChallengeInput {
  goal_id: string
  name: string
  description?: string | null
  duration_days: number
  task_description: string
  start_date: string
  end_date: string
}

export interface UpdateChallengeInput {
  name?: string
  description?: string | null
  task_description?: string
}

export interface CreateChallengeInvitationInput {
  challenge_id: string
  invitee_user_id: string
}

export interface UpdateChallengeInvitationInput {
  status: 'accepted' | 'declined'
}

export interface CreateChallengeEvidenceInput {
  challenge_id: string
  evidence_date: string
  file_name: string
  storage_path: string
  media_type: 'photo' | 'video'
  media_url: string
  thumbnail_url?: string | null
  file_size_bytes?: number | null
  mime_type?: string | null
  notes?: string | null
}

export interface ChallengeWithDetails extends Challenge {
  participants?: ChallengeParticipant[]
  invitations?: ChallengeInvitation[]
  evidence?: ChallengeEvidence[]
}
