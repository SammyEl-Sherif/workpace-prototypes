export interface NotionConnection {
  id: string
  user_id: string
  access_token: string
  workspace_id: string | null
  workspace_name: string | null
  bot_id: string | null
  created_at: string
  updated_at: string
}

export interface CreateNotionConnectionInput {
  access_token: string
  workspace_id?: string | null
  workspace_name?: string | null
  bot_id?: string | null
}
