export interface DocuSignConnection {
  id: string
  org_id: string
  access_token: string
  refresh_token: string
  token_expires_at: string
  account_id: string
  base_uri: string
  connected_by: string
  created_at: string
  updated_at: string
}

export interface DocuSignTokenResponse {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
}

export interface DocuSignUserInfo {
  sub: string
  accounts: {
    account_id: string
    is_default: boolean
    account_name: string
    base_uri: string
  }[]
}
