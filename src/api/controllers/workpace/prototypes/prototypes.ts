import { HttpClient, HttpResponse, HttpServer } from '@/server/types'

type Prototypes = {
  id: string
  created_at: string
  name: string
  description: string
  tech_stack: string
  stage: string
}[]

export const getWorkPacePrototypesController = async (
  client: HttpClient
): Promise<HttpResponse<any>> => {
  try {
    const { data: prototypes } = await client.request<Prototypes>({
      url: '/prototypes/',
      method: 'get',
      server: HttpServer.WorkPace,
      timeout: 0,
    })

    return {
      data: prototypes,
      status: 200,
    }
  } catch (error) {
    console.log(error)
    return {
      data: [],
      status: 500,
    }
  }
}
