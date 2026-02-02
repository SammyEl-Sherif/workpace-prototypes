import { getGoalsRoute, createGoalRoute } from '@/apis/routes/good-things/goals/goals'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper({
  [HttpMethod.GET]: getGoalsRoute,
  [HttpMethod.POST]: createGoalRoute,
})
