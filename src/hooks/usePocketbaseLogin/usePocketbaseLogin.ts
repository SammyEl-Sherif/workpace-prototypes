import { useEvent, useManualFetch } from '@/hooks'

export const usePocketbaseLogin = () => {
  const signIn = useManualFetch<any>('auth/login', { method: 'post' })

  return useEvent(async ({ email, password }: { email?: string; password?: string }) => {
    return signIn({ data: { email, password } })
  })
}
