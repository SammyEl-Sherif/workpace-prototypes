import { createContext, useMemo, FC, PropsWithChildren, useContext, useState } from 'react'
import { NotionDatabase } from '@/interfaces/notion'

type NotionDatabaseContextState = {
  database_id: string | null
  databases: NotionDatabase[] | null
  filters: {
    property: string
    status: {
      equals: string
    } | null
  } | null
}
type NotionDatabaseContextUpdater = (updater: Partial<NotionDatabaseContextState>) => void

type NotionDatabaseContextProps = Omit<NotionDatabaseContextState, 'filters'> & {
  filters: {
    property: string
    status: {
      equals: string
    } | null
  } | null
}

const NotionDatabaseContext = createContext<{
  state: NotionDatabaseContextState
  update: NotionDatabaseContextUpdater
}>({
  state: { database_id: null, databases: null, filters: null },
  update: () => {},
})

export const NotionDatabaseContextProvider: FC<PropsWithChildren<NotionDatabaseContextProps>> = ({
  children,
  database_id,
  databases,
  filters,
}) => {
  const [state, setState] = useState<NotionDatabaseContextState>({
    database_id,
    filters,
    databases,
  })

  const update: NotionDatabaseContextUpdater = (updater) => {
    setState((prevState) => ({ ...prevState, ...updater }))
  }

  const contextValue = useMemo(() => ({ state, update }), [state])

  return (
    <NotionDatabaseContext.Provider value={contextValue}>{children}</NotionDatabaseContext.Provider>
  )
}

export const useNotionDatabaseContext = () => useContext(NotionDatabaseContext)
