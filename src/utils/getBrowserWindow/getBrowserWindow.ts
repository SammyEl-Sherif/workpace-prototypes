export const getBrowserWindow = (): Window | undefined => {
  return typeof window !== 'undefined' && window.document ? window : undefined
}
