import { disconnectDocuSignRoute } from '@/apis/routes/docusign/oauth'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper({
  DELETE: disconnectDocuSignRoute,
})
