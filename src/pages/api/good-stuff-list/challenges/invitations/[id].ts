import { updateChallengeInvitationController } from '@/apis/controllers/challenges/challenges.controller'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper({
  [HttpMethod.PUT]: updateChallengeInvitationController,
  [HttpMethod.PATCH]: updateChallengeInvitationController,
})
