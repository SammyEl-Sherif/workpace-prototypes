import { createContext, useEffect, useMemo, FC, PropsWithChildren, useContext, useState } from 'react'

import { Prototype } from '@/interfaces/prototypes'

type PrototypesContextState = Prototype[]

type PrototypesContextUpdater = (updater: PrototypesContextState) => void
type PrototypesContextProps = {
  prototypes: Prototype[]
}

const PrototypesContext = createContext<{
  prototypes: PrototypesContextState
  update: PrototypesContextUpdater
}>({
  prototypes: [],
  update: () => {},
})

export const PrototypesContextProvider: FC<PropsWithChildren<PrototypesContextProps>> = ({
  children,
  prototypes,
}) => {
  const [state, setState] = useState<PrototypesContextState>(prototypes)

  // Sync prop to state on client-side navigation, since useState only
  // uses the initial value on first mount. Pages without getServerSideProps
  // pass undefined, so we skip those to avoid clearing valid data.
  useEffect(() => {
    if (prototypes && prototypes.length > 0) {
      setState(prototypes)
    }
  }, [prototypes])

  const update: PrototypesContextUpdater = (updater) => {
    setState((prevState) => ({ ...prevState, ...updater }))
  }

  const contextValue = useMemo(() => ({ prototypes: state, update }), [state])

  return <PrototypesContext.Provider value={contextValue}>{children}</PrototypesContext.Provider>
}

export const usePrototypesContext = () => useContext(PrototypesContext)
