import { useFetch, useManualFetch } from '@/hooks'

type FriendsResponse = {
  data: { friends: any[] }
  status: number
}

type SearchUsersResponse = {
  data: { users: any[] }
  status: number
}

type FriendInvitationsResponse = {
  data: { invitations: any[] }
  status: number
}

export const useFriends = () => {
  const [response, isLoading, error, , makeRequest] = useFetch<FriendsResponse, null>(
    'friends',
    { method: 'get', manual: true },
    null
  )

  return {
    friends: (response as FriendsResponse)?.data?.friends ?? [],
    isLoading,
    error,
    refetch: makeRequest,
  }
}

export const useFriendInvitations = () => {
  const [response, isLoading, error, , makeRequest] = useFetch<FriendInvitationsResponse, null>(
    'friends/invitations',
    { method: 'get', manual: true },
    null
  )

  return {
    invitations: (response as FriendInvitationsResponse)?.data?.invitations ?? [],
    isLoading,
    error,
    refetch: makeRequest,
  }
}

export const useSearchUsers = () => {
  return useManualFetch<SearchUsersResponse>('friends/search')
}

export const useAddFriend = () => {
  return useManualFetch<{ data: { friend: any }; status: number }>('friends')
}

export const useSendFriendRequest = () => {
  return useManualFetch<{ data: { invitation: any }; status: number }>('friends/invitations')
}

export const useUpdateFriendInvitation = () => {
  return useManualFetch<{ data: { invitation: any }; status: number }>('friends/invitations')
}

export const useRemoveFriend = () => {
  return useManualFetch<{ data: { success: boolean }; status: number }>('friends')
}
