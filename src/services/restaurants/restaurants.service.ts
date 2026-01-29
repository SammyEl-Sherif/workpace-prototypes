import { querySupabase } from '@/db'

interface Restaurant {
  id: string
  name: string
  type?: string
  cuisine_tags?: string[]
  city?: string
  [key: string]: unknown
}

interface HappyHourDay {
  id: string
  restaurant_id: string
  day_of_week: string
  start_time?: string
  end_time?: string
  [key: string]: unknown
}

interface HappyHourItem {
  hh_day_id: string
  item_name?: string
  name?: string
  description?: string
  price_minor?: number | null
  [key: string]: unknown
}

interface HappyHourEvent {
  hh_day_id: string
  label?: string
  name?: string
  description?: string
  price_minor?: number | null
  [key: string]: unknown
}

interface RestaurantHours {
  restaurant_id?: string
  day_of_week: string
  open_time?: string
  close_time?: string
  is_closed: boolean
}

interface RestaurantQueryParams {
  search?: string
  type?: string
  city?: string
  cuisine_tag?: string
  cuisine_tags?: string[]
  pageNum?: number
  pageSize?: number
}

export const RestaurantsService = {
  async getRestaurants(params: RestaurantQueryParams) {
    const {
      search,
      type,
      city,
      cuisine_tag,
      cuisine_tags = [],
      pageNum = 1,
      pageSize = 12,
    } = params

    // Build query parameters
    const queryParams: (string | number | string[] | null)[] = [
      search || null,
      type || null,
      city || null,
      cuisine_tag || null,
      cuisine_tags.length > 0 ? cuisine_tags : null,
      pageSize,
      (pageNum - 1) * pageSize,
    ]

    // Get restaurants
    const restaurants = await querySupabase<Restaurant>(
      'restaurants/get_restaurants.sql',
      queryParams
    )

    // Get total count
    const countParams = queryParams.slice(0, -2) // Remove limit and offset
    const countResult = await querySupabase<{ total: number }>(
      'restaurants/count_restaurants.sql',
      countParams
    )
    const total = countResult[0]?.total || 0

    // Enrich restaurants with happy hour data using batch queries
    const enrichedRestaurants = await this.enrichRestaurantsBatch(restaurants)

    return {
      data: enrichedRestaurants,
      pageNum,
      pageSize,
      total,
    }
  },

  async getRestaurantById(id: string) {
    const restaurants = await querySupabase<Restaurant>('restaurants/get_restaurant_by_id.sql', [
      id,
    ])

    if (restaurants.length === 0) {
      return null
    }

    const restaurant = restaurants[0]
    return await this.enrichRestaurantWithHappyHour(restaurant)
  },

  /**
   * Batch enrichment of multiple restaurants with happy hour data
   * This method reduces N+1 queries by fetching all data in batch queries
   * @param restaurants - Array of restaurants to enrich
   * @returns Array of enriched restaurants
   */
  async enrichRestaurantsBatch(restaurants: Restaurant[]) {
    if (restaurants.length === 0) {
      return restaurants.map((r) => ({ ...r, happy_hour: null, hours: null }))
    }

    const restaurantIds = restaurants.map((r) => r.id).filter(Boolean)

    // Batch fetch all happy hour days for all restaurants
    let allHhDays: HappyHourDay[] = []
    try {
      allHhDays = await querySupabase<HappyHourDay>('restaurants/get_happy_hour_days_batch.sql', [
        restaurantIds,
      ])
    } catch (error) {
      console.log(
        `[RestaurantsService] Error fetching happy hour days batch:`,
        error instanceof Error ? error.message : error
      )
    }

    // Group happy hour days by restaurant_id
    const hhDaysByRestaurant: Record<string, HappyHourDay[]> = {}
    allHhDays.forEach((day) => {
      const restaurantId = String(day.restaurant_id || '')
      if (restaurantId && restaurantId !== 'undefined' && restaurantId !== 'null') {
        if (!hhDaysByRestaurant[restaurantId]) {
          hhDaysByRestaurant[restaurantId] = []
        }
        hhDaysByRestaurant[restaurantId].push(day)
      }
    })

    // Collect all hh_day_ids across all restaurants
    const allHhDayIds = allHhDays
      .map((day) => {
        const id = day.id
        if (typeof id === 'string') {
          const numId = parseInt(id, 10)
          return isNaN(numId) ? null : numId
        }
        return typeof id === 'number' ? id : null
      })
      .filter((id): id is number => id !== null)

    // Batch fetch all drink items, food items, and events
    let allDrinkItems: HappyHourItem[] = []
    let allFoodItems: HappyHourItem[] = []
    let allEventItems: HappyHourEvent[] = []

    if (allHhDayIds.length > 0) {
      try {
        allDrinkItems = await querySupabase<HappyHourItem>(
          'restaurants/get_happy_hour_drink_items.sql',
          [allHhDayIds]
        )
      } catch (error) {
        console.log('Error fetching drink items batch:', error)
      }

      try {
        allFoodItems = await querySupabase<HappyHourItem>(
          'restaurants/get_happy_hour_food_items.sql',
          [allHhDayIds]
        )
      } catch (error) {
        console.log('Error fetching food items batch:', error)
      }

      try {
        allEventItems = await querySupabase<HappyHourEvent>(
          'restaurants/get_happy_hour_events.sql',
          [allHhDayIds]
        )
      } catch (error) {
        console.log('Error fetching events batch:', error)
      }
    }

    // Group items by hh_day_id
    const drinkItemsByDay: Record<string, HappyHourItem[]> = {}
    const foodItemsByDay: Record<string, HappyHourItem[]> = {}
    const eventItemsByDay: Record<string, HappyHourEvent[]> = {}

    allDrinkItems.forEach((item) => {
      const dayId = String(item.hh_day_id || '')
      if (dayId && dayId !== 'undefined' && dayId !== 'null') {
        if (!drinkItemsByDay[dayId]) {
          drinkItemsByDay[dayId] = []
        }
        drinkItemsByDay[dayId].push(item)
      }
    })

    allFoodItems.forEach((item) => {
      const dayId = String(item.hh_day_id || '')
      if (dayId && dayId !== 'undefined' && dayId !== 'null') {
        if (!foodItemsByDay[dayId]) {
          foodItemsByDay[dayId] = []
        }
        foodItemsByDay[dayId].push(item)
      }
    })

    allEventItems.forEach((item) => {
      const dayId = String(item.hh_day_id || '')
      if (dayId && dayId !== 'undefined' && dayId !== 'null') {
        if (!eventItemsByDay[dayId]) {
          eventItemsByDay[dayId] = []
        }
        eventItemsByDay[dayId].push(item)
      }
    })

    // Batch fetch all restaurant hours
    let allRestaurantHours: RestaurantHours[] = []
    try {
      allRestaurantHours = await querySupabase<RestaurantHours>(
        'restaurants/get_restaurant_hours_batch.sql',
        [restaurantIds]
      )
    } catch (error) {
      console.log('Error fetching restaurant hours batch:', error)
    }

    // Group restaurant hours by restaurant_id
    const hoursByRestaurant: Record<string, RestaurantHours[]> = {}
    allRestaurantHours.forEach((hour) => {
      const restaurantId = String(hour.restaurant_id || '')
      if (restaurantId && restaurantId !== 'undefined' && restaurantId !== 'null') {
        if (!hoursByRestaurant[restaurantId]) {
          hoursByRestaurant[restaurantId] = []
        }
        hoursByRestaurant[restaurantId].push(hour)
      }
    })

    // Enrich each restaurant with its happy hour data
    return restaurants.map((restaurant) => {
      const restaurantId = restaurant.id
      const hhDays = hhDaysByRestaurant[restaurantId] || []

      if (hhDays.length === 0) {
        const restaurantHoursList = hoursByRestaurant[restaurantId] || []
        const hoursByDay = this.buildHoursByDay(restaurantHoursList)
        return {
          ...restaurant,
          happy_hour: null,
          hours: restaurantHoursList.length > 0 ? hoursByDay : null,
        }
      }

      // Build happy hour object for this restaurant
      const happyHour = this.buildHappyHourObject(
        hhDays,
        drinkItemsByDay,
        foodItemsByDay,
        eventItemsByDay
      )

      // Build hours object for this restaurant
      const restaurantHoursList = hoursByRestaurant[restaurantId] || []
      const hoursByDay = this.buildHoursByDay(restaurantHoursList)

      return {
        ...restaurant,
        happy_hour: happyHour,
        hours: restaurantHoursList.length > 0 ? hoursByDay : null,
      }
    })
  },

  /**
   * Build happy hour object from happy hour days and items
   */
  buildHappyHourObject(
    hhDays: HappyHourDay[],
    drinkItemsByDay: Record<string, HappyHourItem[]>,
    foodItemsByDay: Record<string, HappyHourItem[]>,
    eventItemsByDay: Record<string, HappyHourEvent[]>
  ) {
    const days: string[] = []
    const dayToTimeMap: Record<string, string> = {}
    const dayToMenuMap: Record<
      string,
      { drinkSpecials: string[]; foodSpecials: string[]; events: string[] }
    > = {}
    const drinkSpecials: string[] = []
    const foodSpecials: string[] = []
    const events: string[] = []

    hhDays.forEach((hhDay) => {
      const dayName = hhDay.day_of_week || ''
      if (dayName) {
        const normalizedDay = dayName.toLowerCase()
        if (!days.includes(normalizedDay)) {
          days.push(normalizedDay)
        }

        const startTime = hhDay.start_time || ''
        const endTime = hhDay.end_time || ''
        if (startTime && endTime) {
          dayToTimeMap[normalizedDay] = `${startTime} - ${endTime}`
        }
      }

      const dayDrinks: string[] = []
      const dayFoods: string[] = []
      const dayEventItems: string[] = []

      const hhDayIdForMap = String(hhDay.id || '')

      const dayDrinkItems = drinkItemsByDay[hhDayIdForMap] || []
      dayDrinkItems.forEach((item) => {
        const itemName = item.item_name || item.name || ''
        const description = item.description || ''
        let display = ''
        if (itemName && description) {
          display = `${itemName} - ${description}`
          drinkSpecials.push(display)
          dayDrinks.push(display)
        } else if (itemName) {
          drinkSpecials.push(itemName)
          dayDrinks.push(itemName)
        }
      })

      const dayFoodItems = foodItemsByDay[hhDayIdForMap] || []
      dayFoodItems.forEach((item) => {
        const itemName = item.item_name || item.name || ''
        const description = item.description || ''
        let display = ''
        if (itemName && description) {
          display = `${itemName} - ${description}`
          foodSpecials.push(display)
          dayFoods.push(display)
        } else if (itemName) {
          foodSpecials.push(itemName)
          dayFoods.push(itemName)
        }
      })

      const dayEventItemList = eventItemsByDay[hhDayIdForMap] || []
      dayEventItemList.forEach((item) => {
        const label = item.label || item.name || ''
        const description = item.description || ''
        let display = ''
        if (label && description) {
          display = `${label} - ${description}`
          events.push(display)
          dayEventItems.push(display)
        } else if (label) {
          events.push(label)
          dayEventItems.push(label)
        }
      })

      if (dayName) {
        const normalizedDayForMenu = dayName.toLowerCase()
        if (dayToMenuMap[normalizedDayForMenu]) {
          const existingMenu = dayToMenuMap[normalizedDayForMenu]
          dayDrinks.forEach((item) => {
            if (!existingMenu.drinkSpecials.includes(item)) {
              existingMenu.drinkSpecials.push(item)
            }
          })
          dayFoods.forEach((item) => {
            if (!existingMenu.foodSpecials.includes(item)) {
              existingMenu.foodSpecials.push(item)
            }
          })
          dayEventItems.forEach((item) => {
            if (!existingMenu.events.includes(item)) {
              existingMenu.events.push(item)
            }
          })
        } else {
          dayToMenuMap[normalizedDayForMenu] = {
            drinkSpecials: dayDrinks,
            foodSpecials: dayFoods,
            events: dayEventItems,
          }
        }
      }
    })

    const uniqueTimes = [...new Set(Object.values(dayToTimeMap))]
    const times = uniqueTimes.length === 1 ? uniqueTimes[0] : uniqueTimes.join(', ')

    const happyHourDaysArray = hhDays.map((hhDay) => {
      const dayName = hhDay.day_of_week || ''
      const normalizedDay = dayName.toLowerCase()
      const hhDayId = String(hhDay.id || '')

      const dayDrinkItems = drinkItemsByDay[hhDayId] || []
      const dayFoodItems = foodItemsByDay[hhDayId] || []
      const dayEventItems = eventItemsByDay[hhDayId] || []

      return {
        id: hhDay.id,
        day_of_week: normalizedDay,
        start_time: hhDay.start_time || '',
        end_time: hhDay.end_time || '',
        drink_items: dayDrinkItems.map((item) => ({
          item_name: item.item_name || item.name || '',
          description: item.description || '',
          price_minor: item.price_minor || null,
        })),
        food_items: dayFoodItems.map((item) => ({
          item_name: item.item_name || item.name || '',
          description: item.description || '',
          price_minor: item.price_minor || null,
        })),
        events: dayEventItems.map((item) => ({
          label: item.label || item.name || '',
          description: item.description || '',
          price_minor: item.price_minor || null,
        })),
      }
    })

    return days.length > 0
      ? {
          days: days,
          times: times,
          dayToTimeMap: dayToTimeMap,
          dayToMenuMap: dayToMenuMap,
          happy_hour_days: happyHourDaysArray,
          menu: {
            foodSpecials: foodSpecials.length > 0 ? foodSpecials : [],
            drinkSpecials: drinkSpecials.length > 0 ? drinkSpecials : [],
            events: events.length > 0 ? events : [],
          },
        }
      : null
  },

  /**
   * Build hours by day object from restaurant hours array
   */
  buildHoursByDay(restaurantHours: RestaurantHours[]) {
    const hoursByDay: Record<
      string,
      { open_time?: string; close_time?: string; is_closed: boolean }
    > = {}
    restaurantHours.forEach((hour) => {
      const dayName = hour.day_of_week || ''
      if (dayName) {
        const normalizedDay = dayName.toLowerCase()
        hoursByDay[normalizedDay] = {
          open_time: hour.open_time || undefined,
          close_time: hour.close_time || undefined,
          is_closed: hour.is_closed || false,
        }
      }
    })
    return hoursByDay
  },

  async enrichRestaurantWithHappyHour(restaurant: Restaurant) {
    const restaurantId = restaurant.id

    // Fetch happy hour days
    let hhDays: HappyHourDay[] = []
    try {
      hhDays = await querySupabase<HappyHourDay>('restaurants/get_happy_hour_days.sql', [
        restaurantId,
      ])
    } catch (error) {
      console.log(
        `[RestaurantsService] Error fetching happy hour days:`,
        error instanceof Error ? error.message : error
      )
    }

    if (hhDays.length === 0) {
      return { ...restaurant, happy_hour: null, hours: null }
    }

    // Fetch drink items, food items, and events
    const hhDayIds = hhDays
      .map((day) => {
        const id = day.id
        if (typeof id === 'string') {
          const numId = parseInt(id, 10)
          return isNaN(numId) ? null : numId
        }
        return typeof id === 'number' ? id : null
      })
      .filter((id): id is number => id !== null)

    let drinkItems: HappyHourItem[] = []
    let foodItems: HappyHourItem[] = []
    let eventItems: HappyHourEvent[] = []

    if (hhDayIds.length > 0) {
      try {
        drinkItems = await querySupabase<HappyHourItem>(
          'restaurants/get_happy_hour_drink_items.sql',
          [hhDayIds]
        )
      } catch (error) {
        console.log('Error fetching drink items:', error)
      }

      try {
        foodItems = await querySupabase<HappyHourItem>(
          'restaurants/get_happy_hour_food_items.sql',
          [hhDayIds]
        )
      } catch (error) {
        console.log('Error fetching food items:', error)
      }

      try {
        eventItems = await querySupabase<HappyHourEvent>('restaurants/get_happy_hour_events.sql', [
          hhDayIds,
        ])
      } catch (error) {
        console.log('Error fetching events:', error)
      }
    }

    // Group items by hh_day_id
    const drinkItemsByDay: Record<string, HappyHourItem[]> = {}
    const foodItemsByDay: Record<string, HappyHourItem[]> = {}
    const eventItemsByDay: Record<string, HappyHourEvent[]> = {}

    drinkItems.forEach((item) => {
      const dayId = String(item.hh_day_id || '')
      if (dayId && dayId !== 'undefined' && dayId !== 'null') {
        if (!drinkItemsByDay[dayId]) {
          drinkItemsByDay[dayId] = []
        }
        drinkItemsByDay[dayId].push(item)
      }
    })

    foodItems.forEach((item) => {
      const dayId = String(item.hh_day_id || '')
      if (dayId && dayId !== 'undefined' && dayId !== 'null') {
        if (!foodItemsByDay[dayId]) {
          foodItemsByDay[dayId] = []
        }
        foodItemsByDay[dayId].push(item)
      }
    })

    eventItems.forEach((item) => {
      const dayId = String(item.hh_day_id || '')
      if (dayId && dayId !== 'undefined' && dayId !== 'null') {
        if (!eventItemsByDay[dayId]) {
          eventItemsByDay[dayId] = []
        }
        eventItemsByDay[dayId].push(item)
      }
    })

    // Build happy hour object
    const days: string[] = []
    const dayToTimeMap: Record<string, string> = {}
    const dayToMenuMap: Record<
      string,
      { drinkSpecials: string[]; foodSpecials: string[]; events: string[] }
    > = {}
    const drinkSpecials: string[] = []
    const foodSpecials: string[] = []
    const events: string[] = []

    hhDays.forEach((hhDay) => {
      const dayName = hhDay.day_of_week || ''
      if (dayName) {
        const normalizedDay = dayName.toLowerCase()
        if (!days.includes(normalizedDay)) {
          days.push(normalizedDay)
        }

        const startTime = hhDay.start_time || ''
        const endTime = hhDay.end_time || ''
        if (startTime && endTime) {
          dayToTimeMap[normalizedDay] = `${startTime} - ${endTime}`
        }
      }

      const dayDrinks: string[] = []
      const dayFoods: string[] = []
      const dayEventItems: string[] = []

      const hhDayIdForMap = String(hhDay.id || '')

      const dayDrinkItems = drinkItemsByDay[hhDayIdForMap] || []
      dayDrinkItems.forEach((item) => {
        const itemName = item.item_name || item.name || ''
        const description = item.description || ''
        let display = ''
        if (itemName && description) {
          display = `${itemName} - ${description}`
          drinkSpecials.push(display)
          dayDrinks.push(display)
        } else if (itemName) {
          drinkSpecials.push(itemName)
          dayDrinks.push(itemName)
        }
      })

      const dayFoodItems = foodItemsByDay[hhDayIdForMap] || []
      dayFoodItems.forEach((item) => {
        const itemName = item.item_name || item.name || ''
        const description = item.description || ''
        let display = ''
        if (itemName && description) {
          display = `${itemName} - ${description}`
          foodSpecials.push(display)
          dayFoods.push(display)
        } else if (itemName) {
          foodSpecials.push(itemName)
          dayFoods.push(itemName)
        }
      })

      const dayEventItemList = eventItemsByDay[hhDayIdForMap] || []
      dayEventItemList.forEach((item) => {
        const label = item.label || item.name || ''
        const description = item.description || ''
        let display = ''
        if (label && description) {
          display = `${label} - ${description}`
          events.push(display)
          dayEventItems.push(display)
        } else if (label) {
          events.push(label)
          dayEventItems.push(label)
        }
      })

      if (dayName) {
        const normalizedDayForMenu = dayName.toLowerCase()
        if (dayToMenuMap[normalizedDayForMenu]) {
          const existingMenu = dayToMenuMap[normalizedDayForMenu]
          dayDrinks.forEach((item) => {
            if (!existingMenu.drinkSpecials.includes(item)) {
              existingMenu.drinkSpecials.push(item)
            }
          })
          dayFoods.forEach((item) => {
            if (!existingMenu.foodSpecials.includes(item)) {
              existingMenu.foodSpecials.push(item)
            }
          })
          dayEventItems.forEach((item) => {
            if (!existingMenu.events.includes(item)) {
              existingMenu.events.push(item)
            }
          })
        } else {
          dayToMenuMap[normalizedDayForMenu] = {
            drinkSpecials: dayDrinks,
            foodSpecials: dayFoods,
            events: dayEventItems,
          }
        }
      }
    })

    const uniqueTimes = [...new Set(Object.values(dayToTimeMap))]
    const times = uniqueTimes.length === 1 ? uniqueTimes[0] : uniqueTimes.join(', ')

    const happyHourDaysArray = hhDays.map((hhDay) => {
      const dayName = hhDay.day_of_week || ''
      const normalizedDay = dayName.toLowerCase()
      const hhDayId = String(hhDay.id || '')

      const dayDrinkItems = drinkItemsByDay[hhDayId] || []
      const dayFoodItems = foodItemsByDay[hhDayId] || []
      const dayEventItems = eventItemsByDay[hhDayId] || []

      return {
        id: hhDay.id,
        day_of_week: normalizedDay,
        start_time: hhDay.start_time || '',
        end_time: hhDay.end_time || '',
        drink_items: dayDrinkItems.map((item) => ({
          item_name: item.item_name || item.name || '',
          description: item.description || '',
          price_minor: item.price_minor || null,
        })),
        food_items: dayFoodItems.map((item) => ({
          item_name: item.item_name || item.name || '',
          description: item.description || '',
          price_minor: item.price_minor || null,
        })),
        events: dayEventItems.map((item) => ({
          label: item.label || item.name || '',
          description: item.description || '',
          price_minor: item.price_minor || null,
        })),
      }
    })

    const happyHour =
      days.length > 0
        ? {
            days: days,
            times: times,
            dayToTimeMap: dayToTimeMap,
            dayToMenuMap: dayToMenuMap,
            happy_hour_days: happyHourDaysArray,
            menu: {
              foodSpecials: foodSpecials.length > 0 ? foodSpecials : [],
              drinkSpecials: drinkSpecials.length > 0 ? drinkSpecials : [],
              events: events.length > 0 ? events : [],
            },
          }
        : null

    // Fetch restaurant hours
    let restaurantHours: RestaurantHours[] = []
    try {
      restaurantHours = await querySupabase<RestaurantHours>(
        'restaurants/get_restaurant_hours.sql',
        [restaurantId]
      )
    } catch (error) {
      console.log('Error fetching restaurant hours:', error)
    }

    const hoursByDay: Record<
      string,
      { open_time?: string; close_time?: string; is_closed: boolean }
    > = {}
    restaurantHours.forEach((hour) => {
      const dayName = hour.day_of_week || ''
      if (dayName) {
        const normalizedDay = dayName.toLowerCase()
        hoursByDay[normalizedDay] = {
          open_time: hour.open_time || undefined,
          close_time: hour.close_time || undefined,
          is_closed: hour.is_closed || false,
        }
      }
    })

    return {
      ...restaurant,
      happy_hour: happyHour,
      hours: restaurantHours.length > 0 ? hoursByDay : null,
    }
  },
}
