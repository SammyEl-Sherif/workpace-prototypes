export type PortalUserRole = 'admin' | 'member'

export type PortalUserStatus = 'pending_approval' | 'active' | 'deactivated'

export interface Organization {
  id: string
  name: string
  domain: string | null
  created_at: string
  updated_at: string
}

export interface PortalUser {
  id: string
  user_id: string
  org_id: string
  role: PortalUserRole
  status: PortalUserStatus
  created_at: string
  updated_at: string
}

export interface PortalUserWithOrg extends PortalUser {
  org_name: string
  org_domain: string | null
}

export interface CreateOrganizationInput {
  name: string
  domain?: string
}

export interface PortalSignupInput {
  org_name: string
}
