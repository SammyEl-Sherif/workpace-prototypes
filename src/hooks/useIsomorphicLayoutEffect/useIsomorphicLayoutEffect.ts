import { DependencyList, EffectCallback, useEffect, useLayoutEffect } from 'react'

import { getBrowserWindow } from '@/utils'

export const useIsomorphicLayoutEffect = (effect: EffectCallback, deps?: DependencyList): void => {
  const handler = getBrowserWindow() ? useLayoutEffect : useEffect

  handler(effect, deps)
}
