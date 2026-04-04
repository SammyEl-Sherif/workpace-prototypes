import { getDocuSignConnectionStatusRoute } from '@/apis/routes/docusign/oauth'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper({
  GET: getDocuSignConnectionStatusRoute,
})
