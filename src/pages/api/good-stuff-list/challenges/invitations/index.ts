import {
  getChallengeInvitationsController,
  createChallengeInvitationController,
} from '@/apis/controllers/challenges/challenges.controller'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper({
  [HttpMethod.GET]: getChallengeInvitationsController,
  [HttpMethod.POST]: createChallengeInvitationController,
})
