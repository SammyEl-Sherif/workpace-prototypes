import { useFetch } from '@/hooks'
import { RecordAuthResponse, RecordModel } from 'pocketbase'

export const usePocketbaseLogin = () => {
  const [response, isLoading, error, _, makeRequest] = useFetch<{ user: RecordAuthResponse }, null>(
    'auth/login',
    {
      data: {
        username: process.env.PB_ADMIN_USERNAME,
        password: process.env.PB_ADMIN_PASSWORD,
      },
      manual: true,
    },
    null
  )
  return {
    user: response?.user ?? null,
    isLoading,
    error,
    makeRequest,
  }
}
