-- Declarative Schema for Contracts
-- This file defines the desired final state of the contracts table
-- NOTE: update_updated_at_column() is defined in _functions.sql
-- NOTE: Depends on organizations.sql and docusign_connections.sql

-- Create enum types for contracts
DO $$ BEGIN
  CREATE TYPE public.contract_status AS ENUM ('draft', 'sent', 'signed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.contract_signing_method AS ENUM ('redirect', 'email');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Contracts table: stores contract records linked to DocuSign envelopes
CREATE TABLE IF NOT EXISTS public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  version INT NOT NULL DEFAULT 1,
  status public.contract_status NOT NULL DEFAULT 'draft'::public.contract_status,
  signing_method public.contract_signing_method NOT NULL DEFAULT 'redirect'::public.contract_signing_method,
  envelope_id TEXT,
  template_id TEXT,
  document_url TEXT,
  signer_email TEXT NOT NULL,
  signer_name TEXT NOT NULL,
  sent_at TIMESTAMPTZ,
  signed_at TIMESTAMPTZ,
  voided_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_contracts_org_id ON public.contracts(org_id);
CREATE INDEX IF NOT EXISTS idx_contracts_envelope_id ON public.contracts(envelope_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON public.contracts(status);

-- Enable Row Level Security
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for contracts table
-- Active portal users can view their org's contracts
DROP POLICY IF EXISTS "Portal users can view their org contracts" ON public.contracts;
CREATE POLICY "Portal users can view their org contracts"
  ON public.contracts
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.portal_users
      WHERE portal_users.org_id = contracts.org_id
      AND portal_users.user_id = auth.uid()
      AND portal_users.status = 'active'::public.portal_user_status
    )
  );

-- Admins can manage all contracts
DROP POLICY IF EXISTS "Admins can manage contracts" ON public.contracts;
CREATE POLICY "Admins can manage contracts"
  ON public.contracts
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
DROP TRIGGER IF EXISTS update_contracts_updated_at ON public.contracts;
CREATE TRIGGER update_contracts_updated_at
  BEFORE UPDATE ON public.contracts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
