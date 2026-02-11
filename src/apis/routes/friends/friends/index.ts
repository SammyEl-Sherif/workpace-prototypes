import { createFriendRoute, getFriendsRoute } from './friends'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper({
  [HttpMethod.GET]: getFriendsRoute,
  [HttpMethod.POST]: createFriendRoute,
})
