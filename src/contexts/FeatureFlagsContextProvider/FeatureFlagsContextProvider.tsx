import { FC, createContext, useCallback, useContext, useMemo } from 'react'

import { FeatureFlagMap } from '@/apis/controllers/feature-flags/feature-flags.types'
import { useUserInfoContext } from '@/contexts/UserInfoContextProvider'
import { useFeatureFlags } from '@/hooks/useFeatureFlags'
import { UserGroup } from '@/interfaces/user'

interface FeatureFlagsContextState {
  /** Map of flag key -> boolean enabled state */
  flags: FeatureFlagMap
  /** Check if a specific flag is enabled. Returns false if the flag doesn't exist. */
  isEnabled: (key: string) => boolean
  /**
   * Check if an admin-only flag is enabled.
   * Returns true ONLY if the flag is enabled AND the current user has an admin role.
   * If the flag is off, returns false for everyone (including admins).
   */
  isAdminEnabled: (key: string) => boolean
  /** Whether the current user has an admin role */
  isAdmin: boolean
  /** Whether the flags are currently being loaded */
  isLoading: boolean
  /** Error message if flags failed to load */
  error: string | null
  /** Manually refetch flags */
  refetch: () => Promise<void>
}

const FeatureFlagsContext = createContext<FeatureFlagsContextState | undefined>(undefined)

interface FeatureFlagsContextProviderProps {
  children: React.ReactNode
}

/**
 * Provider that fetches feature flags once and makes them available
 * throughout the component tree via useFeatureFlagsContext().
 *
 * Must be nested inside UserInfoContextProvider (needs user roles for admin checks).
 *
 * Usage:
 * ```tsx
 * // In _app.tsx
 * <UserInfoContextProvider>
 *   <FeatureFlagsContextProvider>
 *     <Component {...pageProps} />
 *   </FeatureFlagsContextProvider>
 * </UserInfoContextProvider>
 *
 * // In any component — simple boolean flag
 * const { isEnabled } = useFeatureFlagsContext()
 * if (isEnabled('my-feature')) { ... }
 *
 * // Admin-only flag — only true for admins when flag is on
 * const { isAdminEnabled } = useFeatureFlagsContext()
 * if (isAdminEnabled('maintenance-overlay')) { ... }
 * ```
 */
export const FeatureFlagsContextProvider: FC<FeatureFlagsContextProviderProps> = ({ children }) => {
  const { flags, isEnabled, isLoading, error, refetch } = useFeatureFlags()
  const { userProfile } = useUserInfoContext()

  const isAdmin = useMemo(
    () => userProfile?.roles?.includes(UserGroup.Admin) ?? false,
    [userProfile?.roles]
  )

  const isAdminEnabled = useCallback(
    (key: string): boolean => {
      return flags[key] === true && isAdmin
    },
    [flags, isAdmin]
  )

  const contextValue = useMemo(
    () => ({ flags, isEnabled, isAdminEnabled, isAdmin, isLoading, error, refetch }),
    [flags, isEnabled, isAdminEnabled, isAdmin, isLoading, error, refetch]
  )

  return (
    <FeatureFlagsContext.Provider value={contextValue}>{children}</FeatureFlagsContext.Provider>
  )
}

/**
 * Access feature flags from the context.
 * Must be used within a FeatureFlagsContextProvider.
 */
export const useFeatureFlagsContext = (): FeatureFlagsContextState => {
  const state = useContext(FeatureFlagsContext)

  if (typeof state === 'undefined') {
    throw new Error('useFeatureFlagsContext must be used within a FeatureFlagsContextProvider')
  }

  return state
}
