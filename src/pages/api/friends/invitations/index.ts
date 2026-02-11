import {
  getFriendInvitationsController,
  createFriendInvitationController,
} from '@/apis/controllers/friends/friends.controller'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper({
  [HttpMethod.GET]: getFriendInvitationsController,
  [HttpMethod.POST]: createFriendInvitationController,
})
