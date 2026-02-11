import { updateFriendInvitationController } from '@/apis/controllers/friends/friends.controller'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper({
  [HttpMethod.PATCH]: updateFriendInvitationController,
})
