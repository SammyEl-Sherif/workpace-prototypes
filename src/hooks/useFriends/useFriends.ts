import { useFetch, useManualFetch } from '@/hooks'

type FriendsResponse = {
  data: { friends: any[] }
  status: number
}

type SearchUsersResponse = {
  data: { users: any[] }
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

export const useSearchUsers = () => {
  return useManualFetch<SearchUsersResponse>('friends/search')
}

export const useAddFriend = () => {
  return useManualFetch<{ data: { friend: any }; status: number }>('friends')
}

export const useRemoveFriend = () => {
  return useManualFetch<{ data: { success: boolean }; status: number }>('friends')
}
