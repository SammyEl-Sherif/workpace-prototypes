export type FriendInvitationStatus = 'pending' | 'accepted' | 'declined'

export interface Friend {
  id: string
  user_id: string
  friend_id: string
  created_at: string
  updated_at: string
}

export interface FriendWithUser {
  id: string
  user_id: string
  friend_id: string
  created_at: string
  updated_at: string
  friend: {
    id: string
    email: string | null
    name: string | null
    given_name: string | null
    family_name: string | null
  }
}

export interface FriendInvitation {
  id: string
  inviter_user_id: string
  invitee_user_id: string
  status: FriendInvitationStatus
  created_at: string
  updated_at: string
  inviter_name?: string | null
  inviter_email?: string | null
  invitee_name?: string | null
  invitee_email?: string | null
}

export interface CreateFriendInput {
  friend_id: string
}

export interface CreateFriendInvitationInput {
  invitee_user_id: string
}

export interface UpdateFriendInvitationInput {
  status: FriendInvitationStatus
}

export interface SearchUserResult {
  id: string
  email: string | null
  name: string | null
  given_name: string | null
  family_name: string | null
}
