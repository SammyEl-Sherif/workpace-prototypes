-- Declarative Schema for DocuSign Connections
-- This file defines the desired final state of the docusign_connections table
-- NOTE: update_updated_at_column() is defined in _functions.sql
-- NOTE: Depends on organizations.sql

-- DocuSign connections table: stores OAuth tokens per organization
CREATE TABLE IF NOT EXISTS public.docusign_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL UNIQUE REFERENCES public.organizations(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  token_expires_at TIMESTAMPTZ NOT NULL,
  account_id TEXT NOT NULL,
  base_uri TEXT NOT NULL,
  connected_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_docusign_connections_org_id ON public.docusign_connections(org_id);

-- Enable Row Level Security
ALTER TABLE public.docusign_connections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for docusign_connections table
-- Portal admins can view their org's connection
DROP POLICY IF EXISTS "Portal admins can view their org connection" ON public.docusign_connections;
CREATE POLICY "Portal admins can view their org connection"
  ON public.docusign_connections
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.portal_users
      WHERE portal_users.org_id = docusign_connections.org_id
      AND portal_users.user_id = auth.uid()
      AND portal_users.status = 'active'::public.portal_user_status
      AND portal_users.role = 'admin'::public.portal_user_role
    )
  );

-- Portal admins can insert connections for their org
DROP POLICY IF EXISTS "Portal admins can create org connection" ON public.docusign_connections;
CREATE POLICY "Portal admins can create org connection"
  ON public.docusign_connections
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.portal_users
      WHERE portal_users.org_id = docusign_connections.org_id
      AND portal_users.user_id = auth.uid()
      AND portal_users.status = 'active'::public.portal_user_status
      AND portal_users.role = 'admin'::public.portal_user_role
    )
  );

-- Portal admins can update their org's connection
DROP POLICY IF EXISTS "Portal admins can update org connection" ON public.docusign_connections;
CREATE POLICY "Portal admins can update org connection"
  ON public.docusign_connections
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.portal_users
      WHERE portal_users.org_id = docusign_connections.org_id
      AND portal_users.user_id = auth.uid()
      AND portal_users.status = 'active'::public.portal_user_status
      AND portal_users.role = 'admin'::public.portal_user_role
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.portal_users
      WHERE portal_users.org_id = docusign_connections.org_id
      AND portal_users.user_id = auth.uid()
      AND portal_users.status = 'active'::public.portal_user_status
      AND portal_users.role = 'admin'::public.portal_user_role
    )
  );

-- Portal admins can delete their org's connection
DROP POLICY IF EXISTS "Portal admins can delete org connection" ON public.docusign_connections;
CREATE POLICY "Portal admins can delete org connection"
  ON public.docusign_connections
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.portal_users
      WHERE portal_users.org_id = docusign_connections.org_id
      AND portal_users.user_id = auth.uid()
      AND portal_users.status = 'active'::public.portal_user_status
      AND portal_users.role = 'admin'::public.portal_user_role
    )
  );

-- Admins can manage all connections
DROP POLICY IF EXISTS "Admins can manage docusign connections" ON public.docusign_connections;
CREATE POLICY "Admins can manage docusign connections"
  ON public.docusign_connections
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
DROP TRIGGER IF EXISTS update_docusign_connections_updated_at ON public.docusign_connections;
CREATE TRIGGER update_docusign_connections_updated_at
  BEFORE UPDATE ON public.docusign_connections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
