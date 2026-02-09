-- Declarative Schema for Consultation Requests
-- This file defines the desired final state of the consultation_requests table
-- NOTE: update_updated_at_column() is defined in _functions.sql

-- Create enum type for consultation request status
DO $$ BEGIN
  CREATE TYPE public.consultation_request_status AS ENUM (
    'requested',
    'in_review',
    'accepted',
    'declined'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create enum type for consultation service type
DO $$ BEGIN
  CREATE TYPE public.consultation_service_type AS ENUM (
    'notion-templates',
    'notion-consulting',
    'software-products',
    'software-consulting',
    'other'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create enum type for consultation budget range
DO $$ BEGIN
  CREATE TYPE public.consultation_budget_range AS ENUM (
    'under-1k',
    '1k-5k',
    '5k-15k',
    '15k-50k',
    '50k+',
    'unsure'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create enum type for consultation timeline
DO $$ BEGIN
  CREATE TYPE public.consultation_timeline AS ENUM (
    'asap',
    '1-2-weeks',
    '1-month',
    '1-3-months',
    'flexible'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Consultation requests table
-- Submissions can come from unauthenticated visitors (public form)
CREATE TABLE IF NOT EXISTS public.consultation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Requester details
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  -- Project details
  service public.consultation_service_type NOT NULL,
  budget public.consultation_budget_range,
  timeline public.consultation_timeline,
  message TEXT,
  -- Review status
  status public.consultation_request_status NOT NULL DEFAULT 'requested',
  admin_notes TEXT,
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Constraints
  CONSTRAINT consultation_requests_name_not_empty CHECK (char_length(trim(name)) > 0),
  CONSTRAINT consultation_requests_email_not_empty CHECK (char_length(trim(email)) > 0)
);

-- Indexes for querying
CREATE INDEX IF NOT EXISTS idx_consultation_requests_status ON public.consultation_requests(status);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_email ON public.consultation_requests(email);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_created_at ON public.consultation_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_service ON public.consultation_requests(service);

-- Enable Row Level Security
ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow anonymous inserts (public consultation form)
-- Anyone can submit a consultation request without being authenticated
DROP POLICY IF EXISTS "Anyone can submit a consultation request" ON public.consultation_requests;
CREATE POLICY "Anyone can submit a consultation request"
  ON public.consultation_requests
  FOR INSERT
  WITH CHECK (true);

-- RLS Policy: Only service_role (server-side) can read/update/delete requests
-- Admin operations should go through server-side API routes using the service_role key
DROP POLICY IF EXISTS "Service role can manage consultation requests" ON public.consultation_requests;
CREATE POLICY "Service role can manage consultation requests"
  ON public.consultation_requests
  FOR ALL
  USING (auth.role() = 'service_role');

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_consultation_requests_updated_at ON public.consultation_requests;
CREATE TRIGGER update_consultation_requests_updated_at
  BEFORE UPDATE ON public.consultation_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
