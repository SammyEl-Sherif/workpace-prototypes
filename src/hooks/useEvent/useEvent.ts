import { useRef } from 'react'

import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect'

export const useEvent = <T extends (...args: any[]) => any>(callback: T): T => {
  const latestRef = useRef<T | null>(null)

  useIsomorphicLayoutEffect(() => {
    latestRef.current = callback
  }, [callback])

  const stableRef = useRef<T | null>(null)

  if (!stableRef.current) {
    stableRef.current = function (this: unknown, ...args: any[]) {
      return latestRef.current?.apply(this, args)
    } as unknown as T
  }

  return stableRef.current
}
