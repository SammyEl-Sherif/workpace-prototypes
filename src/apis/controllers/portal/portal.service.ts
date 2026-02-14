import { querySupabase } from '@/db'

import { Organization, PortalUser, PortalUserStatus, PortalUserWithOrg } from './portal.types'

export const PortalService = {
  async getPortalUser(userId: string): Promise<PortalUser | null> {
    const results = await querySupabase<PortalUser>('portal_users/get_by_user_id.sql', [userId])
    return results.length > 0 ? results[0] : null
  },

  async getPortalUserWithOrg(userId: string): Promise<PortalUserWithOrg | null> {
    const results = await querySupabase<PortalUserWithOrg>(
      'portal_users/get_by_user_id_with_org.sql',
      [userId]
    )
    return results.length > 0 ? results[0] : null
  },

  async signup(
    userId: string,
    input: { org_name: string }
  ): Promise<{ organization: Organization; portalUser: PortalUser }> {
    if (!input.org_name || input.org_name.trim() === '') {
      throw new Error('Organization name is required')
    }

    // Check if user already has a portal account
    const existing = await this.getPortalUser(userId)
    if (existing) {
      throw new Error('User already has a portal account')
    }

    // Create organization
    const orgResults = await querySupabase<Organization>('organizations/create.sql', [
      input.org_name.trim(),
      null,
    ])
    if (orgResults.length === 0) {
      throw new Error('Failed to create organization')
    }
    const organization = orgResults[0]

    // Create portal user with admin role and pending_approval status
    const portalUserResults = await querySupabase<PortalUser>('portal_users/create.sql', [
      userId,
      organization.id,
      'admin',
      'pending_approval',
    ])
    if (portalUserResults.length === 0) {
      throw new Error('Failed to create portal user')
    }

    return { organization, portalUser: portalUserResults[0] }
  },

  async getAllPending(): Promise<PortalUserWithOrg[]> {
    return querySupabase<PortalUserWithOrg>('portal_users/get_all_pending.sql')
  },

  async updateStatus(portalUserId: string, status: PortalUserStatus): Promise<PortalUser> {
    const results = await querySupabase<PortalUser>('portal_users/update_status.sql', [
      portalUserId,
      status,
    ])
    if (results.length === 0) {
      throw new Error('Portal user not found')
    }
    return results[0]
  },
}
