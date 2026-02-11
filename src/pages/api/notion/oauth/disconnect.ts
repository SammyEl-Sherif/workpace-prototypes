import { disconnectNotionRoute } from '@/apis/routes/notion/oauth/oauth'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper({
  DELETE: disconnectNotionRoute,
})
