import { NextApiRequest, NextApiResponse } from 'next'

import { getRestaurantsController, RestaurantQueryParams } from '@/apis/controllers/restaurants'

/**
 * GET /api/restaurants
 * Public route - no authentication required
 *
 * Query params:
 * - search: string (optional) - search by name, type, or cuisine tags
 * - type: string (optional) - filter by restaurant type
 * - city: string (optional) - filter by city
 * - cuisine_tag: string (optional) - filter by single cuisine tag
 * - cuisine_tags: string (optional) - filter by multiple cuisine tags (comma-separated)
 * - page: number (optional, default: 1) - page number
 * - limit: number (optional, default: 12) - items per page
 */
export const getRestaurantsRoute = async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  const {
    id,
    search,
    type,
    city,
    cuisine_tag,
    cuisine_tags,
    page = '1',
    limit = '12',
  } = request.query

  // If id is provided as query param, redirect to detail route logic
  if (id) {
    // This case is handled by the detail route
    response.status(400).json({ error: 'Use /api/restaurants/[id] for single restaurant' })
    return
  }

  // Reject legacy cuisine parameter
  if (request.query.cuisine) {
    response.status(400).json({
      error:
        "Legacy 'cuisine' field is deprecated. Use 'cuisine_tag' (single) or 'cuisine_tags' (comma-separated) instead.",
    })
    return
  }

  // Parse cuisine_tags if provided as comma-separated string
  let cuisineTagsArray: string[] = []
  if (cuisine_tags) {
    const tagsValue = Array.isArray(cuisine_tags) ? cuisine_tags[0] : cuisine_tags
    cuisineTagsArray = String(tagsValue)
      .split(',')
      .map((t: string) => t.trim())
      .filter(Boolean)
  }

  const params: RestaurantQueryParams = {
    search: search ? String(search).trim() : undefined,
    type: type ? String(type).trim() : undefined,
    city: city ? String(city).trim() : undefined,
    cuisine_tag: cuisine_tag ? String(cuisine_tag).trim() : undefined,
    cuisine_tags: cuisineTagsArray.length > 0 ? cuisineTagsArray : undefined,
    pageNum: parseInt(String(page), 10) || 1,
    pageSize: parseInt(String(limit), 10) || 12,
  }

  try {
    const { data, status } = await getRestaurantsController(params)
    response.status(status).json(data)
  } catch (error) {
    console.error('[getRestaurantsRoute] Error:', error)
    response.status(500).json({ error: 'Internal server error' })
  }
}
