import { useCallback, useRef } from 'react'

const DEFAULT_DELAY = 200 // ms

export const useDebounce = <F extends (...args: any[]) => any>(
  func: F,
  delay = DEFAULT_DELAY
): ((...args: Parameters<F>) => void) => {
  const timer = useRef<ReturnType<typeof setTimeout>>()
  const debounce = useCallback(
    (...args: Parameters<F>) => {
      const timeoutId = timer.current

      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      timer.current = setTimeout(() => {
        func(...args)
      }, delay)
    },
    [delay, func]
  )
  return debounce
}
