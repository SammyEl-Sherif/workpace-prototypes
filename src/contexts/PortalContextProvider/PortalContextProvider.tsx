import { FC, createContext, useCallback, useContext, useMemo } from 'react'

import { PortalUserWithOrg } from '@/interfaces/portal'
import { useFetch } from '@/hooks'

interface PortalContextState {
  portalUser: PortalUserWithOrg | null
  isLoading: boolean
  error: Error | null
  isPortalMember: boolean
  isApproved: boolean
  isPending: boolean
  refetch: () => void
}

const PortalContext = createContext<PortalContextState | undefined>(undefined)

interface PortalContextProviderProps {
  children: React.ReactNode
}

export const PortalContextProvider: FC<PortalContextProviderProps> = ({ children }) => {
  const [response, isLoading, error, , refetch] = useFetch<
    { data: { portalUser: PortalUserWithOrg | null } },
    null
  >('portal/me', { method: 'get' }, null)

  const portalUser = response?.data?.portalUser ?? null

  const isPortalMember = portalUser !== null
  const isApproved = portalUser?.status === 'active'
  const isPending = portalUser?.status === 'pending_approval'

  const contextValue = useMemo(
    () => ({
      portalUser,
      isLoading,
      error,
      isPortalMember,
      isApproved,
      isPending,
      refetch,
    }),
    [portalUser, isLoading, error, isPortalMember, isApproved, isPending, refetch]
  )

  return <PortalContext.Provider value={contextValue}>{children}</PortalContext.Provider>
}

export const usePortalContext = (): PortalContextState => {
  const state = useContext(PortalContext)

  if (typeof state === 'undefined') {
    throw new Error('usePortalContext must be used within a PortalContextProvider')
  }

  return state
}
