import { HttpResponse } from '@/server/types'

import { FeatureFlagsService } from './feature-flags.service'
import {
  CreateFeatureFlagInput,
  FeatureFlag,
  FeatureFlagMap,
  UpdateFeatureFlagInput,
} from './feature-flags.types'

export const getFeatureFlagsController = async (): Promise<HttpResponse<FeatureFlag[]>> => {
  try {
    const flags = await FeatureFlagsService.getAll()
    return { data: flags, status: 200 }
  } catch (error) {
    console.error('[getFeatureFlagsController] Error:', error)
    return { data: [], status: 500 }
  }
}

export const getFeatureFlagMapController = async (): Promise<HttpResponse<FeatureFlagMap>> => {
  try {
    const flagMap = await FeatureFlagsService.getEnabledMap()
    return { data: flagMap, status: 200 }
  } catch (error) {
    console.error('[getFeatureFlagMapController] Error:', error)
    return { data: {}, status: 500 }
  }
}

export const getFeatureFlagByKeyController = async (
  key: string
): Promise<HttpResponse<FeatureFlag | null>> => {
  try {
    const flag = await FeatureFlagsService.getByKey(key)
    if (!flag) {
      return { data: null, status: 404 }
    }
    return { data: flag, status: 200 }
  } catch (error) {
    console.error('[getFeatureFlagByKeyController] Error:', error)
    return { data: null, status: 500 }
  }
}

export const createFeatureFlagController = async (
  input: CreateFeatureFlagInput,
  userId?: string
): Promise<HttpResponse<FeatureFlag | null>> => {
  try {
    if (!input.key || !input.name) {
      return { data: null, status: 400 }
    }

    // Validate key format (lowercase, hyphens, underscores only)
    const keyRegex = /^[a-z][a-z0-9_-]*$/
    if (!keyRegex.test(input.key)) {
      return { data: null, status: 400 }
    }

    const flag = await FeatureFlagsService.create(input, userId)
    return { data: flag, status: 201 }
  } catch (error: unknown) {
    const err = error as { code?: string }
    // Unique constraint violation on key
    if (err.code === '23505') {
      return { data: null, status: 409 }
    }
    console.error('[createFeatureFlagController] Error:', error)
    return { data: null, status: 500 }
  }
}

export const updateFeatureFlagController = async (
  id: string,
  input: UpdateFeatureFlagInput,
  userId?: string
): Promise<HttpResponse<FeatureFlag | null>> => {
  try {
    if (input.key) {
      const keyRegex = /^[a-z][a-z0-9_-]*$/
      if (!keyRegex.test(input.key)) {
        return { data: null, status: 400 }
      }
    }

    const flag = await FeatureFlagsService.update(id, input, userId)
    if (!flag) {
      return { data: null, status: 404 }
    }
    return { data: flag, status: 200 }
  } catch (error: unknown) {
    const err = error as { code?: string }
    if (err.code === '23505') {
      return { data: null, status: 409 }
    }
    console.error('[updateFeatureFlagController] Error:', error)
    return { data: null, status: 500 }
  }
}

export const toggleFeatureFlagController = async (
  id: string,
  userId?: string
): Promise<HttpResponse<FeatureFlag | null>> => {
  try {
    const flag = await FeatureFlagsService.toggle(id, userId)
    if (!flag) {
      return { data: null, status: 404 }
    }
    return { data: flag, status: 200 }
  } catch (error) {
    console.error('[toggleFeatureFlagController] Error:', error)
    return { data: null, status: 500 }
  }
}

export const deleteFeatureFlagController = async (
  id: string
): Promise<HttpResponse<{ success: boolean }>> => {
  try {
    const deleted = await FeatureFlagsService.delete(id)
    if (!deleted) {
      return { data: { success: false }, status: 404 }
    }
    return { data: { success: true }, status: 200 }
  } catch (error) {
    console.error('[deleteFeatureFlagController] Error:', error)
    return { data: { success: false }, status: 500 }
  }
}
