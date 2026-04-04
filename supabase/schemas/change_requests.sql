-- Declarative Schema for Change Requests
-- This file defines the desired final state of the change_requests table
-- NOTE: update_updated_at_column() is defined in _functions.sql
-- NOTE: Depends on organizations.sql and portal_users.sql

-- Create enum types for change requests
DO $$ BEGIN
  CREATE TYPE public.change_request_category AS ENUM (
    'bug_fix', 'feature_request', 'improvement', 'documentation', 'other'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.change_request_priority AS ENUM ('low', 'medium', 'high', 'urgent');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.change_request_status AS ENUM (
    'submitted', 'under_review', 'approved', 'in_progress', 'completed', 'rejected'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Change requests table: stores client change/feature requests
CREATE TABLE IF NOT EXISTS public.change_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  submitted_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category public.change_request_category NOT NULL DEFAULT 'other'::public.change_request_category,
  priority public.change_request_priority NOT NULL DEFAULT 'medium'::public.change_request_priority,
  status public.change_request_status NOT NULL DEFAULT 'submitted'::public.change_request_status,
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_change_requests_org_id ON public.change_requests(org_id);
CREATE INDEX IF NOT EXISTS idx_change_requests_status ON public.change_requests(status);
CREATE INDEX IF NOT EXISTS idx_change_requests_submitted_by ON public.change_requests(submitted_by);

-- Enable Row Level Security
ALTER TABLE public.change_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for change_requests table
-- Active portal users can view their org's requests
DROP POLICY IF EXISTS "Portal users can view their org requests" ON public.change_requests;
CREATE POLICY "Portal users can view their org requests"
  ON public.change_requests
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.portal_users
      WHERE portal_users.org_id = change_requests.org_id
      AND portal_users.user_id = auth.uid()
      AND portal_users.status = 'active'::public.portal_user_status
    )
  );

-- Active portal users can create requests for their org
DROP POLICY IF EXISTS "Portal users can create org requests" ON public.change_requests;
CREATE POLICY "Portal users can create org requests"
  ON public.change_requests
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.portal_users
      WHERE portal_users.org_id = change_requests.org_id
      AND portal_users.user_id = auth.uid()
      AND portal_users.status = 'active'::public.portal_user_status
    )
  );

-- Portal users can update their own requests only if still 'submitted'
DROP POLICY IF EXISTS "Portal users can update own submitted requests" ON public.change_requests;
CREATE POLICY "Portal users can update own submitted requests"
  ON public.change_requests
  FOR UPDATE
  USING (
    submitted_by = auth.uid()
    AND status = 'submitted'::public.change_request_status
  )
  WITH CHECK (
    submitted_by = auth.uid()
    AND status = 'submitted'::public.change_request_status
  );

-- Admins can manage all change requests
DROP POLICY IF EXISTS "Admins can manage change requests" ON public.change_requests;
CREATE POLICY "Admins can manage change requests"
  ON public.change_requests
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
DROP TRIGGER IF EXISTS update_change_requests_updated_at ON public.change_requests;
CREATE TRIGGER update_change_requests_updated_at
  BEFORE UPDATE ON public.change_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
