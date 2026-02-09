import {
  createContext,
  useEffect,
  useMemo,
  FC,
  PropsWithChildren,
  useContext,
  useState,
} from 'react'

import { App } from '@/interfaces/apps'

type AppsContextState = App[]

type AppsContextUpdater = (updater: AppsContextState) => void
type AppsContextProps = {
  apps: App[]
}

const AppsContext = createContext<{
  apps: AppsContextState
  update: AppsContextUpdater
}>({
  apps: [],
  update: () => {},
})

export const AppsContextProvider: FC<PropsWithChildren<AppsContextProps>> = ({
  children,
  apps,
}) => {
  const [state, setState] = useState<AppsContextState>(apps)

  // Sync prop to state on client-side navigation, since useState only
  // uses the initial value on first mount. Pages without getServerSideProps
  // pass undefined, so we skip those to avoid clearing valid data.
  useEffect(() => {
    if (apps && apps.length > 0) {
      setState(apps)
    }
  }, [apps])

  const update: AppsContextUpdater = (updater) => {
    setState((prevState) => ({ ...prevState, ...updater }))
  }

  const contextValue = useMemo(() => ({ apps: state, update }), [state])

  return <AppsContext.Provider value={contextValue}>{children}</AppsContext.Provider>
}

export const useAppsContext = () => useContext(AppsContext)
