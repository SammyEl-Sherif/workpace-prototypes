export interface FeatureFlag {
  id: string
  key: string
  name: string
  description: string | null
  enabled: boolean
  created_by: string | null
  updated_by: string | null
  created_at: string
  updated_at: string
}

export interface FeatureFlagMap {
  [key: string]: boolean
}

export interface CreateFeatureFlagInput {
  key: string
  name: string
  description?: string
  enabled?: boolean
}

export interface UpdateFeatureFlagInput {
  key?: string
  name?: string
  description?: string
  enabled?: boolean
}
