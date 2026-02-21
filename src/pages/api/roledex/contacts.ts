import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'
import { processContactPromptRoute } from '@/apis/routes/roledex/contacts/contacts'

export default apiRequestWrapper({
  [HttpMethod.POST]: processContactPromptRoute,
})
