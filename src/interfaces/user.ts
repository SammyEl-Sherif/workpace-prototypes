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

export enum UserPermissions {}
