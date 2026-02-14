import {
  getChallengesRoute,
  createChallengeRoute,
} from '@/apis/routes/challenges/challenges/challenges'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper({
  [HttpMethod.GET]: getChallengesRoute,
  [HttpMethod.POST]: createChallengeRoute,
})
