export interface Restaurant {
  id: string
  name: string
  type?: string
  cuisine_tags?: string[]
  city?: string
  [key: string]: unknown
}

export interface HappyHourDay {
  id: string
  restaurant_id: string
  day_of_week: string
  start_time?: string
  end_time?: string
  [key: string]: unknown
}

export interface HappyHourItem {
  hh_day_id: string
  item_name?: string
  name?: string
  description?: string
  price_minor?: number | null
  [key: string]: unknown
}

export interface HappyHourEvent {
  hh_day_id: string
  label?: string
  name?: string
  description?: string
  price_minor?: number | null
  [key: string]: unknown
}

export interface RestaurantHours {
  restaurant_id?: string
  day_of_week: string
  open_time?: string
  close_time?: string
  is_closed: boolean
}

export interface RestaurantQueryParams {
  search?: string
  type?: string
  city?: string
  cuisine_tag?: string
  cuisine_tags?: string[]
  pageNum?: number
  pageSize?: number
}

export interface RestaurantsListResponse {
  data: Restaurant[]
  pageNum: number
  pageSize: number
  total: number
}

export interface RestaurantResponse {
  data: Restaurant | null
}
