import { createFriendRoute, getFriendsRoute } from '@/apis/routes/friends/friends/friends'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper({
  [HttpMethod.GET]: getFriendsRoute,
  [HttpMethod.POST]: createFriendRoute,
})
