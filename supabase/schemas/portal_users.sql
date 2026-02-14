-- Declarative Schema for Portal Users
-- This file defines the desired final state of the portal_users table
-- NOTE: update_updated_at_column() is defined in _functions.sql
-- NOTE: Depends on organizations.sql (must sort after alphabetically)

-- Create enum types for portal users
DO $$ BEGIN
  CREATE TYPE public.portal_user_role AS ENUM ('admin', 'member');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.portal_user_status AS ENUM ('pending_approval', 'active', 'deactivated');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Portal users table: links auth users to organizations with role and status
CREATE TABLE IF NOT EXISTS public.portal_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  role public.portal_user_role NOT NULL DEFAULT 'admin'::public.portal_user_role,
  status public.portal_user_status NOT NULL DEFAULT 'pending_approval'::public.portal_user_status,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT portal_users_user_org_unique UNIQUE (user_id, org_id)
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_portal_users_user_id ON public.portal_users(user_id);
CREATE INDEX IF NOT EXISTS idx_portal_users_org_id ON public.portal_users(org_id);
CREATE INDEX IF NOT EXISTS idx_portal_users_status ON public.portal_users(status);

-- Enable Row Level Security
ALTER TABLE public.portal_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for portal_users table
-- Users can view their own portal records
DROP POLICY IF EXISTS "Users can view their own portal records" ON public.portal_users;
CREATE POLICY "Users can view their own portal records"
  ON public.portal_users
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can self-insert with status=pending_approval
DROP POLICY IF EXISTS "Users can sign up for portal" ON public.portal_users;
CREATE POLICY "Users can sign up for portal"
  ON public.portal_users
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND status = 'pending_approval'::public.portal_user_status
  );

-- Admins can manage all portal users
DROP POLICY IF EXISTS "Admins can manage portal users" ON public.portal_users;
CREATE POLICY "Admins can manage portal users"
  ON public.portal_users
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

-- Organization member-view RLS policy (defined here to avoid circular dependency)
-- Portal users can view the organization they belong to
DROP POLICY IF EXISTS "Portal users can view their organization" ON public.organizations;
CREATE POLICY "Portal users can view their organization"
  ON public.organizations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.portal_users
      WHERE portal_users.org_id = organizations.id
      AND portal_users.user_id = auth.uid()
    )
  );

-- Allow service role to insert organizations (for signup flow)
DROP POLICY IF EXISTS "Service role can insert organizations" ON public.organizations;
CREATE POLICY "Service role can insert organizations"
  ON public.organizations
  FOR INSERT
  WITH CHECK (true);

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_portal_users_updated_at ON public.portal_users;
CREATE TRIGGER update_portal_users_updated_at
  BEFORE UPDATE ON public.portal_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
