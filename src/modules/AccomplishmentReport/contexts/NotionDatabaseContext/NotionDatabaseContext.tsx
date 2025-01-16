import { createContext, useMemo, FC, PropsWithChildren, useContext, useState } from 'react'

import { QueryDatabaseParameters } from '@notionhq/client/build/src/api-endpoints'

type NotionDatabaseContextState = {
  database_id: string | null
  filters: QueryDatabaseParameters['filter'] | null
}
type NotionDatabaseContextUpdater = (updater: Partial<NotionDatabaseContextState>) => void

type NotionDatabaseContextProps = Pick<NotionDatabaseContextState, 'database_id'> & {
  filters: QueryDatabaseParameters['filter'] | null
}

const NotionDatabaseContext = createContext<{
  state: NotionDatabaseContextState
  update: NotionDatabaseContextUpdater
}>({
  state: { database_id: null, filters: null },
  update: () => {},
})

export const NotionDatabaseContextProvider: FC<PropsWithChildren<NotionDatabaseContextProps>> = ({
  children,
  database_id,
  filters,
}) => {
  const [state, setState] = useState<NotionDatabaseContextState>({ database_id, filters })

  const update: NotionDatabaseContextUpdater = (updater) => {
    setState((prevState) => ({ ...prevState, ...updater }))
  }

  const contextValue = useMemo(() => ({ state, update }), [state])

  return (
    <NotionDatabaseContext.Provider value={contextValue}>{children}</NotionDatabaseContext.Provider>
  )
}

export const useNotionDatabaseContext = () => useContext(NotionDatabaseContext)
