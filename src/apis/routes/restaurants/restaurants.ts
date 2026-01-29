import { NextApiRequest, NextApiResponse } from 'next'

import { getRestaurantsController, getRestaurantByIdController } from '@/apis/controllers'

export const getRestaurantsRoute = async (request: NextApiRequest, response: NextApiResponse) => {
  try {
    // Check if requesting a single restaurant by ID (query parameter)
    const restaurantId = request.query.id?.toString().trim()
    if (restaurantId) {
      const { data, status } = await getRestaurantByIdController(restaurantId)
      return response.status(status).json(data)
    }

    const { city, cuisine_tag, cuisine_tags, type, search, page = 1, limit = 12 } = request.query

    // Parse cuisine_tags if provided as comma-separated string
    let cuisineTagsArray: string[] = []
    if (cuisine_tags) {
      cuisineTagsArray = Array.isArray(cuisine_tags)
        ? cuisine_tags.map((t: string) => String(t).trim()).filter(Boolean)
        : String(cuisine_tags)
            .split(',')
            .map((t: string) => t.trim())
            .filter(Boolean)
    }

    const params = {
      search: search ? String(search).trim() : undefined,
      type: type ? String(type).trim() : undefined,
      city: city ? String(city).trim() : undefined,
      cuisine_tag: cuisine_tag ? String(cuisine_tag).trim() : undefined,
      cuisine_tags: cuisineTagsArray.length > 0 ? cuisineTagsArray : undefined,
      pageNum: parseInt(String(page), 10) || 1,
      pageSize: parseInt(String(limit), 10) || 12,
    }

    const { data, status } = await getRestaurantsController(params)
    response.status(status).json(data)
  } catch (error: any) {
    response.status(error.statusCode || 500).json({ error: error.message })
  }
}

export const getRestaurantByIdRoute = async (
  request: NextApiRequest,
  response: NextApiResponse
) => {
  try {
    const { id } = request.query
    if (!id || typeof id !== 'string') {
      return response.status(400).json({ error: 'Restaurant ID is required' })
    }

    const { data, status } = await getRestaurantByIdController(id)
    response.status(status).json(data)
  } catch (error: any) {
    response.status(error.statusCode || 500).json({ error: error.message })
  }
}
