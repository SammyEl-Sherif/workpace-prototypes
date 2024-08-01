import { createAxiosClient } from '../axios/createAxiosClient'

export const createHttpClient = (...args: Parameters<typeof createAxiosClient>) => {
  const client = createAxiosClient(...args)

  return client
}
