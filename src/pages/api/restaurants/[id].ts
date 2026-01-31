import { getRestaurantByIdRoute } from '@/apis/routes/restaurants'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper({
  [HttpMethod.GET]: getRestaurantByIdRoute,
})
