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

// Intake Submissions

export interface CompanyInfoData {
  company_name?: string
  industry?: string
  company_size?: string
  website?: string
  primary_contact_name?: string
  primary_contact_email?: string
  primary_contact_phone?: string
}

export interface ToolsTechData {
  current_tools?: string[]
  preferred_platforms?: string[]
  integrations_needed?: string[]
  tech_notes?: string
}

export interface GoalsNeedsData {
  primary_goals?: string[]
  pain_points?: string[]
  timeline?: string
  budget_range?: string
  additional_notes?: string
}

export type IntakeSubmissionStatus = 'draft' | 'submitted' | 'reviewed'

export interface IntakeSubmission {
  id: string
  org_id: string
  submitted_by: string
  status: IntakeSubmissionStatus
  company_info: CompanyInfoData
  tools_tech: ToolsTechData
  goals_needs: GoalsNeedsData
  submitted_at: string | null
  created_at: string
  updated_at: string
}

export interface SaveIntakeInput {
  company_info?: CompanyInfoData
  tools_tech?: ToolsTechData
  goals_needs?: GoalsNeedsData
}

// Change Requests

export type ChangeRequestCategory =
  | 'bug_fix'
  | 'feature_request'
  | 'improvement'
  | 'documentation'
  | 'other'

export type ChangeRequestPriority = 'low' | 'medium' | 'high' | 'urgent'

export type ChangeRequestStatus =
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'in_progress'
  | 'completed'
  | 'rejected'

export interface ChangeRequest {
  id: string
  org_id: string
  submitted_by: string
  title: string
  description: string
  category: ChangeRequestCategory
  priority: ChangeRequestPriority
  status: ChangeRequestStatus
  admin_notes: string | null
  created_at: string
  updated_at: string
}

export interface CreateChangeRequestInput {
  title: string
  description: string
  category: ChangeRequestCategory
  priority: ChangeRequestPriority
}
