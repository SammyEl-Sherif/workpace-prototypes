import {
  getChallengeByIdController,
  updateChallengeController,
  deleteChallengeController,
} from '@/apis/controllers/challenges/challenges.controller'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper({
  [HttpMethod.GET]: getChallengeByIdController,
  [HttpMethod.PUT]: updateChallengeController,
  [HttpMethod.PATCH]: updateChallengeController,
  [HttpMethod.DELETE]: deleteChallengeController,
})
