import { SupabaseAdapter } from '@next-auth/supabase-adapter'
import { NextAuthOptions, Session } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import Credentials from 'next-auth/providers/credentials'

import { Routes } from '@/interfaces/routes'

import { getAuthCookiesOptions } from './getAuthCookiesOptions'

export const getAuthOptions = (): NextAuthOptions => {
  const maxAge = 60 * 60 * 24 * 7 // 7 days

  // Get Supabase configuration
  const supabaseUrl = process.env.NEXT_PUBLIC_WORKPACE_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.WORKPACE_SUPABASE_SERVICE_ROLE_KEY

  const providers = [
    // Supabase Credentials provider - allows using Supabase Auth with NextAuth
    Credentials({
      id: 'supabase',
      name: 'Supabase',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        phone: { label: 'Phone', type: 'tel' },
        otp: { label: 'OTP', type: 'text' },
      },
      async authorize(credentials) {
        if (!supabaseUrl || !supabaseServiceRoleKey) {
          return null
        }

        try {
          const { createClient } = await import('@supabase/supabase-js')
          const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

          // Handle email/password authentication
          if (credentials?.email && credentials?.password) {
            const { data, error } = await supabase.auth.signInWithPassword({
              email: credentials.email,
              password: credentials.password,
            })

            if (error || !data.user) {
              return null
            }

            return {
              id: data.user.id,
              email: data.user.email,
              name: data.user.user_metadata?.name || data.user.email,
              image: data.user.user_metadata?.avatar_url || null,
            }
          }

          // Handle phone/OTP authentication
          if (credentials?.phone && credentials?.otp) {
            const { data, error } = await supabase.auth.verifyOtp({
              phone: credentials.phone,
              token: credentials.otp,
              type: 'sms',
            })

            if (error || !data.user) {
              return null
            }

            return {
              id: data.user.id,
              email: data.user.email,
              phone: data.user.phone,
              name: data.user.user_metadata?.name || data.user.phone,
              image: data.user.user_metadata?.avatar_url || null,
            }
          }

          return null
        } catch (error) {
          console.error('Supabase auth error:', error)
          return null
        }
      },
    }),
  ]

  // Note: Credentials provider requires JWT strategy, so we use JWT even if adapter is available
  // The adapter can still be used for other purposes, but session strategy must be JWT
  const adapter =
    supabaseUrl && supabaseServiceRoleKey
      ? SupabaseAdapter({
          url: supabaseUrl,
          secret: supabaseServiceRoleKey,
        })
      : undefined

  // Force JWT strategy because Credentials provider only works with JWT
  // This allows us to use Supabase authentication via the Credentials provider
  return {
    adapter,
    providers,
    session: {
      strategy: 'jwt', // Must be JWT for Credentials provider to work
      maxAge,
    },
    jwt: {
      maxAge,
    },
    pages: {
      signIn: Routes.SIGNIN,
    },
    cookies: {
      ...getAuthCookiesOptions(),
    },
    callbacks: {
      async session({ session, token }: { session: Session; token?: JWT } | any) {
        // For JWT strategy, use token to populate session
        if (token) {
          if (token.email) {
            session.user = {
              ...session.user,
              email: token.email as string,
              name: (token.name as string) || (token.email as string),
              id: token.id as string,
            }
          }
        }

        return session
      },
      async jwt({ token, user }) {
        // Store user info in token for JWT strategy
        if (user) {
          token.id = user.id
          token.email = user.email
          token.name = user.name
        }
        return token
      },
    },
  }
}
