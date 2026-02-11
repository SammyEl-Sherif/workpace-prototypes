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

export interface CreateFriendInput {
  friend_id: string
}

export interface SearchUserResult {
  id: string
  email: string | null
  name: string | null
  given_name: string | null
  family_name: string | null
}
