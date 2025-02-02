import { createContext, useMemo, FC, PropsWithChildren, useContext, useState } from 'react'

import { ProjectsRecord } from '@/pocketbase-types'

type PocketbaseProjectsContextState = {
  projects: ProjectsRecord[] | null
}
type PocketbaseProjectsContextUpdater = (updater: Partial<PocketbaseProjectsContextState>) => void

type PocketbaseProjectsContextProps = Pick<PocketbaseProjectsContextState, 'projects'>

const PocketbaseProjectsContext = createContext<{
  state: PocketbaseProjectsContextState
  update: PocketbaseProjectsContextUpdater
}>({
  state: { projects: null },
  update: () => {},
})

export const PocketbaseProjectsContextProvider: FC<
  PropsWithChildren<PocketbaseProjectsContextProps>
> = ({ children, projects }) => {
  const [state, setState] = useState<PocketbaseProjectsContextState>({ projects })

  const update: PocketbaseProjectsContextUpdater = (updater) => {
    setState((prevState) => ({ ...prevState, ...updater }))
  }

  const contextValue = useMemo(() => ({ state, update }), [state])

  return (
    <PocketbaseProjectsContext.Provider value={contextValue}>
      {children}
    </PocketbaseProjectsContext.Provider>
  )
}

export const usePocketbaseProjectsContext = () => useContext(PocketbaseProjectsContext)
