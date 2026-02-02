import { useFetch } from '@/hooks'
import { GoodThing } from '@/interfaces/good-things'

type GoodThingsResponse = {
  data: { good_things: GoodThing[] }
  status: number
}

export const useGoodThings = () => {
  const [response, isLoading, error, , makeRequest] = useFetch<
    GoodThingsResponse,
    null
  >('good-stuff-list/good-things', { method: 'get', manual: true }, null)

  return {
    goodThings: (response as GoodThingsResponse)?.data?.good_things ?? [],
    isLoading,
    error,
    refetch: makeRequest,
  }
}
