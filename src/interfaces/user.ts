export enum UserGroup {
  Admin = 'workpace-admin',
  Premium = 'premium',
}

export interface SessionAccount {
  provider: string
  type: string
  providerAccountId: string
  token_type: string
  expires_at: number
  access_token: string
  id_token: string
  scope: string
}

export interface UserProfile {
  roles: UserGroup[]
  nickname?: string
  name?: string
  picture?: string
  email?: string
}

export interface IdToken {
  'https://workpace.io/roles'?: UserGroup[]
  nickname?: string
  name?: string
  picture?: string
  updated_at?: string
  email?: string
  email_verified?: boolean
  iss?: string
  aud?: string
  sub?: string
  iat?: number
  exp?: number
  sid?: string
  auth_time?: number
}

export enum UserPermissions {}
