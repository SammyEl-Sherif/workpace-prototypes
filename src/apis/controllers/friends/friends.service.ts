import { querySupabase } from '@/db'
import { createClient } from '@supabase/supabase-js'
import {
  Friend,
  FriendWithUser,
  CreateFriendInput,
  SearchUserResult,
  FriendInvitation,
  CreateFriendInvitationInput,
  UpdateFriendInvitationInput,
} from './friends.types'

export const FriendsService = {
  async getAll(userId: string): Promise<FriendWithUser[]> {
    const friends = await querySupabase<Friend>('friends/get_all.sql', [userId])

    // Fetch user details for each friend
    const supabaseUrl = process.env.NEXT_PUBLIC_WORKPACE_SUPABASE_URL
    const supabaseServiceRoleKey = process.env.WORKPACE_SUPABASE_SERVICE_ROLE_KEY?.trim()

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error('Server configuration error')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

    const friendsWithUsers: FriendWithUser[] = []

    for (const friend of friends) {
      try {
        const { data: userData, error } = await supabase.auth.admin.getUserById(friend.friend_id)
        if (error || !userData) {
          console.error(`Failed to fetch user ${friend.friend_id}:`, error)
          continue
        }

        friendsWithUsers.push({
          ...friend,
          friend: {
            id: userData.user.id,
            email: userData.user.email || null,
            name: userData.user.user_metadata?.name || userData.user.email || null,
            given_name: userData.user.user_metadata?.given_name || null,
            family_name: userData.user.user_metadata?.family_name || null,
          },
        })
      } catch (error) {
        console.error(`Error fetching user ${friend.friend_id}:`, error)
      }
    }

    return friendsWithUsers
  },

  async create(userId: string, input: CreateFriendInput): Promise<Friend> {
    if (!input.friend_id || input.friend_id.trim() === '') {
      throw new Error('Friend ID is required')
    }

    if (userId === input.friend_id) {
      throw new Error('Cannot add yourself as a friend')
    }

    // Check if friendship already exists
    const existing = await querySupabase<Friend>('friends/get_by_friend_id.sql', [
      userId,
      input.friend_id,
    ])
    if (existing.length > 0) {
      throw new Error('Friend already added')
    }

    // Check if there's already a pending invitation
    const existingInvitation = await querySupabase<FriendInvitation>(
      'friend_invitations/get_by_invitee.sql',
      [input.friend_id]
    )
    const hasPendingInvitation = existingInvitation.some(
      (inv) =>
        (inv.inviter_user_id === userId && inv.invitee_user_id === input.friend_id) ||
        (inv.inviter_user_id === input.friend_id && inv.invitee_user_id === userId)
    )
    if (hasPendingInvitation) {
      throw new Error('Friend request already sent or pending')
    }

    const results = await querySupabase<Friend>('friends/create.sql', [userId, input.friend_id])

    if (results.length === 0) {
      throw new Error('Failed to create friendship')
    }

    return results[0]
  },

  async delete(userId: string, friendId: string): Promise<void> {
    const results = await querySupabase<Friend>('friends/delete.sql', [userId, friendId])

    if (results.length === 0) {
      throw new Error('Friendship not found or you do not have permission to delete it')
    }
  },

  async searchUsers(query: string, currentUserId: string): Promise<SearchUserResult[]> {
    const supabaseUrl = process.env.NEXT_PUBLIC_WORKPACE_SUPABASE_URL
    const supabaseServiceRoleKey = process.env.WORKPACE_SUPABASE_SERVICE_ROLE_KEY?.trim()

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error('Server configuration error')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

    // List all users (Supabase admin API doesn't have a search endpoint)
    // We'll fetch users and filter client-side
    // Note: This is not ideal for large user bases, but works for MVP
    const { data: usersData, error } = await supabase.auth.admin.listUsers()

    if (error) {
      throw new Error('Failed to search users')
    }

    const searchTerm = query.toLowerCase().trim()

    // Filter users by email, name, given_name, or family_name
    const matchingUsers = usersData.users
      .filter((user) => {
        // Exclude current user
        if (user.id === currentUserId) {
          return false
        }

        const email = user.email?.toLowerCase() || ''
        const name = user.user_metadata?.name?.toLowerCase() || ''
        const givenName = user.user_metadata?.given_name?.toLowerCase() || ''
        const familyName = user.user_metadata?.family_name?.toLowerCase() || ''

        return (
          email.includes(searchTerm) ||
          name.includes(searchTerm) ||
          givenName.includes(searchTerm) ||
          familyName.includes(searchTerm)
        )
      })
      .slice(0, 20) // Limit to 20 results
      .map((user) => ({
        id: user.id,
        email: user.email || null,
        name: user.user_metadata?.name || user.email || null,
        given_name: user.user_metadata?.given_name || null,
        family_name: user.user_metadata?.family_name || null,
      }))

    return matchingUsers
  },

  async getPendingInvitations(userId: string): Promise<FriendInvitation[]> {
    // Get invitations where user is the invitee (received)
    const receivedInvitations = await querySupabase<FriendInvitation>(
      'friend_invitations/get_by_invitee.sql',
      [userId]
    )
    // Get invitations where user is the inviter (sent)
    const sentInvitations = await querySupabase<FriendInvitation>(
      'friend_invitations/get_by_inviter.sql',
      [userId]
    )
    // Combine and filter to only pending
    const invitations = [...receivedInvitations, ...sentInvitations].filter(
      (inv) => inv.status === 'pending'
    )

    // Fetch user details for each invitation
    const supabaseUrl = process.env.NEXT_PUBLIC_WORKPACE_SUPABASE_URL
    const supabaseServiceRoleKey = process.env.WORKPACE_SUPABASE_SERVICE_ROLE_KEY?.trim()

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return invitations
    }

    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

    const invitationsWithUsers: FriendInvitation[] = []

    for (const invitation of invitations) {
      try {
        const [inviterData, inviteeData] = await Promise.all([
          supabase.auth.admin.getUserById(invitation.inviter_user_id),
          supabase.auth.admin.getUserById(invitation.invitee_user_id),
        ])

        invitationsWithUsers.push({
          ...invitation,
          inviter_email: inviterData.data?.user?.email || invitation.inviter_email || null,
          inviter_name:
            inviterData.data?.user?.user_metadata?.name ||
            inviterData.data?.user?.email ||
            invitation.inviter_email ||
            null,
          invitee_email: inviteeData.data?.user?.email || invitation.invitee_email || null,
          invitee_name:
            inviteeData.data?.user?.user_metadata?.name ||
            inviteeData.data?.user?.email ||
            invitation.invitee_email ||
            null,
        })
      } catch (error) {
        console.error(`Error fetching user details for invitation ${invitation.id}:`, error)
        invitationsWithUsers.push(invitation)
      }
    }

    return invitationsWithUsers
  },

  async createInvitation(
    userId: string,
    input: CreateFriendInvitationInput
  ): Promise<FriendInvitation> {
    if (!input.invitee_user_id || input.invitee_user_id.trim() === '') {
      throw new Error('Invitee user ID is required')
    }

    if (userId === input.invitee_user_id) {
      throw new Error('Cannot send friend request to yourself')
    }

    // Check if friendship already exists
    const existingFriendship = await querySupabase<Friend>('friends/get_by_friend_id.sql', [
      userId,
      input.invitee_user_id,
    ])
    if (existingFriendship.length > 0) {
      throw new Error('Already friends with this user')
    }

    // Check if there's already a pending invitation (either direction)
    // Check invitations sent by current user
    const sentInvitations = await querySupabase<FriendInvitation>(
      'friend_invitations/get_by_inviter.sql',
      [userId]
    )
    // Check invitations received by current user
    const receivedInvitations = await querySupabase<FriendInvitation>(
      'friend_invitations/get_by_invitee.sql',
      [userId]
    )
    const allInvitations = [...sentInvitations, ...receivedInvitations]
    const hasExistingInvitation = allInvitations.some(
      (inv) =>
        inv.status === 'pending' &&
        ((inv.inviter_user_id === userId && inv.invitee_user_id === input.invitee_user_id) ||
          (inv.inviter_user_id === input.invitee_user_id && inv.invitee_user_id === userId))
    )
    if (hasExistingInvitation) {
      throw new Error('Friend request already sent or pending')
    }

    const results = await querySupabase<FriendInvitation>('friend_invitations/create.sql', [
      userId,
      input.invitee_user_id,
    ])

    if (results.length === 0) {
      throw new Error('Failed to create friend invitation')
    }

    return results[0]
  },

  async updateInvitationStatus(
    invitationId: string,
    userId: string,
    input: UpdateFriendInvitationInput
  ): Promise<FriendInvitation> {
    const results = await querySupabase<FriendInvitation>('friend_invitations/update_status.sql', [
      invitationId,
      input.status,
      userId,
    ])

    if (results.length === 0) {
      throw new Error('Invitation not found or you do not have permission to update it')
    }

    const invitation = results[0]

    // If accepted, create the friendship (bidirectional)
    if (input.status === 'accepted') {
      // Create friendship from inviter to invitee
      await querySupabase<Friend>('friends/create.sql', [
        invitation.inviter_user_id,
        invitation.invitee_user_id,
      ])
      // Create friendship from invitee to inviter (bidirectional)
      await querySupabase<Friend>('friends/create.sql', [
        invitation.invitee_user_id,
        invitation.inviter_user_id,
      ])
    }

    return invitation
  },
}
