import {
  getGoalsRoute,
  getGoalByIdRoute,
  createGoalRoute,
  updateGoalRoute,
  deleteGoalRoute,
} from './goals'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper({
  [HttpMethod.GET]: getGoalsRoute,
  [HttpMethod.POST]: createGoalRoute,
})
