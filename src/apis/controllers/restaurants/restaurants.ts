import { RestaurantsService } from '@/services/restaurants/restaurants.service'
import { HttpResponse } from '@/server/types'

interface RestaurantQueryParams {
  search?: string
  type?: string
  city?: string
  cuisine_tag?: string
  cuisine_tags?: string[]
  pageNum?: number
  pageSize?: number
}

export const getRestaurantsController = async (
  params: RestaurantQueryParams
): Promise<HttpResponse<unknown>> => {
  try {
    // Reject legacy cuisine parameter
    if ('cuisine' in params) {
      return {
        data: {
          error:
            "Legacy 'cuisine' field is deprecated. Use 'cuisine_tag' (single) or 'cuisine_tags' (comma-separated) instead.",
        },
        status: 400,
      }
    }

    const result = await RestaurantsService.getRestaurants(params)
    return {
      data: result,
      status: 200,
    }
  } catch (error: any) {
    return {
      data: { error: error.message || 'Internal server error' },
      status: error.statusCode || 500,
    }
  }
}

export const getRestaurantByIdController = async (id: string): Promise<HttpResponse<unknown>> => {
  try {
    const restaurant = await RestaurantsService.getRestaurantById(id)

    if (!restaurant) {
      return {
        data: { error: 'Restaurant not found' },
        status: 404,
      }
    }

    return {
      data: { data: restaurant },
      status: 200,
    }
  } catch (error: any) {
    return {
      data: { error: error.message || 'Internal server error' },
      status: error.statusCode || 500,
    }
  }
}
