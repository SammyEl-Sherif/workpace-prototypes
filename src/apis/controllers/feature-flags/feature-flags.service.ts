import { querySupabase } from '@/db'

import {
  CreateFeatureFlagInput,
  FeatureFlag,
  FeatureFlagMap,
  UpdateFeatureFlagInput,
} from './feature-flags.types'

export const FeatureFlagsService = {
  async getAll(): Promise<FeatureFlag[]> {
    return querySupabase<FeatureFlag>('feature_flags/get_all.sql', [])
  },

  async getByKey(key: string): Promise<FeatureFlag | null> {
    const results = await querySupabase<FeatureFlag>('feature_flags/get_by_key.sql', [key])
    return results[0] ?? null
  },

  async getEnabledMap(): Promise<FeatureFlagMap> {
    const results = await querySupabase<{ key: string; enabled: boolean }>(
      'feature_flags/get_enabled.sql',
      []
    )
    const map: FeatureFlagMap = {}
    for (const row of results) {
      map[row.key] = row.enabled
    }
    return map
  },

  async create(input: CreateFeatureFlagInput, userId?: string): Promise<FeatureFlag> {
    const results = await querySupabase<FeatureFlag>('feature_flags/create.sql', [
      input.key,
      input.name,
      input.description ?? null,
      input.enabled ?? false,
      userId ?? null,
    ])
    return results[0]
  },

  async update(
    id: string,
    input: UpdateFeatureFlagInput,
    userId?: string
  ): Promise<FeatureFlag | null> {
    const results = await querySupabase<FeatureFlag>('feature_flags/update.sql', [
      id,
      input.key ?? null,
      input.name ?? null,
      input.description ?? null,
      input.enabled ?? null,
      userId ?? null,
    ])
    return results[0] ?? null
  },

  async toggle(id: string, userId?: string): Promise<FeatureFlag | null> {
    const results = await querySupabase<FeatureFlag>('feature_flags/toggle.sql', [
      id,
      userId ?? null,
    ])
    return results[0] ?? null
  },

  async delete(id: string): Promise<boolean> {
    const results = await querySupabase<{ id: string }>('feature_flags/delete.sql', [id])
    return results.length > 0
  },
}
