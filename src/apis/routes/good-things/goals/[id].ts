import { getGoalByIdRoute, updateGoalRoute, deleteGoalRoute } from './goals'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper({
  [HttpMethod.GET]: getGoalByIdRoute,
  [HttpMethod.PUT]: updateGoalRoute,
  [HttpMethod.PATCH]: updateGoalRoute,
  [HttpMethod.DELETE]: deleteGoalRoute,
})
