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
