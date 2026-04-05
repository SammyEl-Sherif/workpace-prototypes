-- Declarative Schema for Agents Table
-- This file defines the desired final state of the agents table

-- Create enum type for agent categories
DO $$ BEGIN
  CREATE TYPE public.agent_category AS ENUM (
    'Productivity',
    'Communication',
    'Data & Analytics',
    'Content',
    'Operations',
    'Finance',
    'Custom'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create enum type for agent pricing
DO $$ BEGIN
  CREATE TYPE public.agent_pricing_type AS ENUM ('free', 'paid');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create agents table
CREATE TABLE IF NOT EXISTS public.agents (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  description_long TEXT,
  image_url TEXT,
  category public.agent_category NOT NULL DEFAULT 'Productivity'::agent_category,
  pricing_type public.agent_pricing_type NOT NULL DEFAULT 'free'::agent_pricing_type,
  price_cents INTEGER NOT NULL DEFAULT 0,
  agent_link TEXT NOT NULL,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT agents_pkey PRIMARY KEY (id),
  CONSTRAINT agents_price_check CHECK (
    (pricing_type = 'free' AND price_cents = 0) OR
    (pricing_type = 'paid' AND price_cents > 0)
  )
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_agents_category ON public.agents USING btree (category);
CREATE INDEX IF NOT EXISTS idx_agents_pricing_type ON public.agents USING btree (pricing_type);
CREATE INDEX IF NOT EXISTS idx_agents_is_published ON public.agents USING btree (is_published);
CREATE INDEX IF NOT EXISTS idx_agents_sort_order ON public.agents USING btree (sort_order);

-- Enable Row Level Security
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

-- RLS Policies: anyone can view published agents (public storefront)
DROP POLICY IF EXISTS "Anyone can view published agents" ON public.agents;
CREATE POLICY "Anyone can view published agents"
  ON public.agents
  FOR SELECT
  USING (is_published = true);

-- RLS Policies: only service_role (server-side) can manage agents
DROP POLICY IF EXISTS "Service role can manage agents" ON public.agents;
CREATE POLICY "Service role can manage agents"
  ON public.agents
  FOR ALL
  USING (auth.role() = 'service_role');

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_agents_updated_at ON public.agents;
CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON public.agents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
