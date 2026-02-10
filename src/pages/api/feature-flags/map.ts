import { getFeatureFlagMapRoute } from '@/apis/routes/feature-flags'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper({
  [HttpMethod.GET]: getFeatureFlagMapRoute,
})
