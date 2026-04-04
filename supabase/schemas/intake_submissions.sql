-- Declarative Schema for Intake Submissions
-- This file defines the desired final state of the intake_submissions table
-- NOTE: update_updated_at_column() is defined in _functions.sql
-- NOTE: Depends on organizations.sql and portal_users.sql

-- Create enum type for intake submission status
DO $$ BEGIN
  CREATE TYPE public.intake_submission_status AS ENUM ('draft', 'submitted', 'reviewed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Intake submissions table: stores client onboarding intake data
CREATE TABLE IF NOT EXISTS public.intake_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  submitted_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status public.intake_submission_status NOT NULL DEFAULT 'draft'::public.intake_submission_status,
  company_info JSONB DEFAULT '{}'::jsonb,
  tools_tech JSONB DEFAULT '{}'::jsonb,
  goals_needs JSONB DEFAULT '{}'::jsonb,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT intake_submissions_org_unique UNIQUE (org_id)
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_intake_submissions_org_id ON public.intake_submissions(org_id);
CREATE INDEX IF NOT EXISTS idx_intake_submissions_status ON public.intake_submissions(status);

-- Enable Row Level Security
ALTER TABLE public.intake_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for intake_submissions table
-- Portal users (pending or active) can view their org's submission
DROP POLICY IF EXISTS "Portal users can view their org intake" ON public.intake_submissions;
CREATE POLICY "Portal users can view their org intake"
  ON public.intake_submissions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.portal_users
      WHERE portal_users.org_id = intake_submissions.org_id
      AND portal_users.user_id = auth.uid()
      AND portal_users.status IN ('pending_approval'::public.portal_user_status, 'active'::public.portal_user_status)
    )
  );

-- Portal users (pending or active) can insert their org's submission
DROP POLICY IF EXISTS "Portal users can create their org intake" ON public.intake_submissions;
CREATE POLICY "Portal users can create their org intake"
  ON public.intake_submissions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.portal_users
      WHERE portal_users.org_id = intake_submissions.org_id
      AND portal_users.user_id = auth.uid()
      AND portal_users.status IN ('pending_approval'::public.portal_user_status, 'active'::public.portal_user_status)
    )
  );

-- Portal users (pending or active) can update their org's submission
DROP POLICY IF EXISTS "Portal users can update their org intake" ON public.intake_submissions;
CREATE POLICY "Portal users can update their org intake"
  ON public.intake_submissions
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.portal_users
      WHERE portal_users.org_id = intake_submissions.org_id
      AND portal_users.user_id = auth.uid()
      AND portal_users.status IN ('pending_approval'::public.portal_user_status, 'active'::public.portal_user_status)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.portal_users
      WHERE portal_users.org_id = intake_submissions.org_id
      AND portal_users.user_id = auth.uid()
      AND portal_users.status IN ('pending_approval'::public.portal_user_status, 'active'::public.portal_user_status)
    )
  );

-- Admins can manage all intake submissions
DROP POLICY IF EXISTS "Admins can manage intake submissions" ON public.intake_submissions;
CREATE POLICY "Admins can manage intake submissions"
  ON public.intake_submissions
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'::public.user_role
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'::public.user_role
    )
  );

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_intake_submissions_updated_at ON public.intake_submissions;
CREATE TRIGGER update_intake_submissions_updated_at
  BEFORE UPDATE ON public.intake_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
