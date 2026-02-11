import {
  getChallengeEvidenceController,
  createChallengeEvidenceController,
} from '@/apis/controllers/challenges/challenges.controller'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper({
  [HttpMethod.GET]: getChallengeEvidenceController,
  [HttpMethod.POST]: createChallengeEvidenceController,
})
