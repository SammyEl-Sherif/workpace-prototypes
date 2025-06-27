import { createContext, FC, ReactNode, useContext, useMemo, useState } from 'react'

type NavbarContextState = {
  isCollapsed: boolean
  setIsCollapsed: (isCollapsed: boolean) => void
}
const NavbarContext = createContext<NavbarContextState | undefined>(undefined)

type NavbarContextProps = {
  children: ReactNode
}

export const NavbarContextProvider: FC<NavbarContextProps> = ({
  children,
}: {
  children: ReactNode
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const contextValue = useMemo(
    () => ({ isCollapsed, setIsCollapsed }),
    [isCollapsed, setIsCollapsed]
  )
  return <NavbarContext.Provider value={contextValue}>{children}</NavbarContext.Provider>
}

export function useNavbarContext() {
  const state = useContext(NavbarContext)

  if (typeof state === 'undefined') {
    throw new Error('useNavbarContext must be used within a NavbarContextProvider')
  }

  return state
}
