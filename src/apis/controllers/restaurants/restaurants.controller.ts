import { HttpResponse } from '@/server/types'

import { RestaurantsService } from './restaurants.service'
import { Restaurant, RestaurantQueryParams, RestaurantsListResponse } from './restaurants.types'

export const getRestaurantsController = async (
  params: RestaurantQueryParams
): Promise<HttpResponse<RestaurantsListResponse>> => {
  try {
    const result = await RestaurantsService.getRestaurants(params)
    return {
      data: result,
      status: 200,
    }
  } catch (error) {
    console.error('[getRestaurantsController] Error:', error)
    return {
      data: { data: [], pageNum: 1, pageSize: 12, total: 0 },
      status: 500,
    }
  }
}

export const getRestaurantByIdController = async (
  id: string
): Promise<HttpResponse<{ data: Restaurant | null }>> => {
  try {
    const restaurant = await RestaurantsService.getRestaurantById(id)

    if (!restaurant) {
      return {
        data: { data: null },
        status: 404,
      }
    }

    return {
      data: { data: restaurant },
      status: 200,
    }
  } catch (error) {
    console.error('[getRestaurantByIdController] Error:', error)
    return {
      data: { data: null },
      status: 500,
    }
  }
}
