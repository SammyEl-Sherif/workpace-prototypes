import { querySupabase } from '@/db'
import {
  CompanyInfoData,
  GoalsNeedsData,
  IntakeSubmission,
  PortalUserWithOrgAndIntake,
  ToolsTechData,
} from '@/interfaces/portal'

import { Organization, PortalUser, PortalUserStatus, PortalUserWithOrg } from './portal.types'
import { IntakeService } from './intake.service'

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

  async signupWithIntake(
    userId: string,
    input: {
      org_name: string
      company_info?: CompanyInfoData
      tools_tech?: ToolsTechData
      goals_needs?: GoalsNeedsData
    }
  ): Promise<{ organization: Organization; portalUser: PortalUser; intake: IntakeSubmission }> {
    const orgName = input.company_info?.company_name?.trim() || input.org_name?.trim()
    if (!orgName) {
      throw new Error('Organization name is required')
    }

    // Check if user already has a portal account
    const existing = await this.getPortalUser(userId)
    if (existing) {
      throw new Error('User already has a portal account')
    }

    // Create organization
    const orgResults = await querySupabase<Organization>('organizations/create.sql', [
      orgName,
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

    // Create intake submission with status 'submitted'
    const intake = await IntakeService.submit(organization.id, userId, {
      company_info: input.company_info,
      tools_tech: input.tools_tech,
      goals_needs: input.goals_needs,
    })

    return { organization, portalUser: portalUserResults[0], intake }
  },

  async getAllPending(): Promise<PortalUserWithOrgAndIntake[]> {
    return querySupabase<PortalUserWithOrgAndIntake>('portal_users/get_all_pending_with_intake.sql')
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
