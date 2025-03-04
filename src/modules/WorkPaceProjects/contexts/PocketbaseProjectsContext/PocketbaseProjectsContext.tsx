import { createContext, useMemo, FC, PropsWithChildren, useContext, useState } from 'react'

import { Prototype } from '@/interfaces/prototypes'

type PrototypesContextState = {
  prototypes: Prototype[]
}
type PrototypesContextUpdater = (updater: Partial<PrototypesContextState>) => void
type PrototypesContextProps = {
  prototypes: Prototype[]
}

const PrototypesContext = createContext<{
  state: PrototypesContextState
  update: PrototypesContextUpdater
}>({
  state: { prototypes: [] },
  update: () => {},
})

export const PrototypesContextProvider: FC<PropsWithChildren<PrototypesContextProps>> = ({
  children,
  prototypes,
}) => {
  const [state, setState] = useState<PrototypesContextState>({ prototypes })

  const update: PrototypesContextUpdater = (updater) => {
    setState((prevState) => ({ ...prevState, ...updater }))
  }

  const contextValue = useMemo(() => ({ state, update }), [state])

  return <PrototypesContext.Provider value={contextValue}>{children}</PrototypesContext.Provider>
}

export const usePrototypesContext = () => useContext(PrototypesContext)
