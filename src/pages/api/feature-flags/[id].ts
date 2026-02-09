import {
  updateFeatureFlagRoute,
  toggleFeatureFlagRoute,
  deleteFeatureFlagRoute,
} from '@/apis/routes/feature-flags'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper({
  [HttpMethod.PUT]: updateFeatureFlagRoute,
  [HttpMethod.PATCH]: toggleFeatureFlagRoute,
  [HttpMethod.DELETE]: deleteFeatureFlagRoute,
})
