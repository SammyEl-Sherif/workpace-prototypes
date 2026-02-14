export interface Goal {
  id: string
  user_id: string
  name: string
  created_at: string
  updated_at: string
}

export interface GoodThing {
  id: string
  user_id: string
  goal_id: string | null
  challenge_id: string | null
  title: string
  description: string | null
  completion_date: string | null
  created_at: string
  updated_at: string
  goal_name?: string | null
}

export interface CreateGoalInput {
  name: string
}

export interface UpdateGoalInput {
  name: string
}

export interface CreateGoodThingInput {
  goal_id?: string | null
  challenge_id?: string | null
  title: string
  description?: string | null
  completion_date?: string | null
}

export interface UpdateGoodThingInput {
  goal_id?: string | null
  title: string
  description?: string | null
  completion_date?: string | null
}

export interface GoodThingMedia {
  id: string
  good_thing_id: string
  user_id: string
  file_name: string
  storage_path: string
  media_type: 'photo' | 'video'
  media_url: string
  thumbnail_url: string | null
  file_size_bytes: number | null
  mime_type: string | null
  created_at: string
}

export interface GoodThingWithMedia extends GoodThing {
  media?: GoodThingMedia[]
}

export interface DayEntry {
  date: string
  goodThings: GoodThingWithMedia[]
}
