import { useCallback, useEffect, useState } from 'react'

import { FeatureFlagMap } from '@/apis/controllers/feature-flags/feature-flags.types'
import { useManualFetch } from '@/hooks/useManualFetch'

interface UseFeatureFlagsReturn {
  /** Map of flag key -> boolean enabled state */
  flags: FeatureFlagMap
  /** Whether a specific flag is enabled. Returns false if the flag doesn't exist. */
  isEnabled: (key: string) => boolean
  /** Whether the flags are currently being loaded */
  isLoading: boolean
  /** Error message if flags failed to load */
  error: string | null
  /** Manually refetch flags */
  refetch: () => Promise<void>
}

/**
 * Hook for consuming feature flags in the application.
 *
 * Usage:
 * ```tsx
 * const { isEnabled } = useFeatureFlags()
 *
 * if (isEnabled('enable-new-dashboard')) {
 *   return <NewDashboard />
 * }
 * return <OldDashboard />
 * ```
 */
export const useFeatureFlags = (): UseFeatureFlagsReturn => {
  const [flags, setFlags] = useState<FeatureFlagMap>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetcher = useManualFetch<FeatureFlagMap>('', {})

  const fetchFlags = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    const [data, err] = await fetcher({
      url: 'feature-flags/map',
      method: 'get',
    })

    if (err) {
      setError('Failed to load feature flags')
      console.error('[useFeatureFlags] Error fetching flags:', err)
    } else if (data) {
      setFlags(data)
    }

    setIsLoading(false)
  }, [fetcher])

  useEffect(() => {
    fetchFlags()
  }, [])

  const isEnabled = useCallback(
    (key: string): boolean => {
      return flags[key] === true
    },
    [flags]
  )

  return {
    flags,
    isEnabled,
    isLoading,
    error,
    refetch: fetchFlags,
  }
}
