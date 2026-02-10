-- Declarative Schema for Apps Table
-- This file defines the desired final state of the apps table

-- Create enum type for app stages
DO $$ BEGIN
  CREATE TYPE public.prototype_stage AS ENUM ('Concept', 'Prototype','Live');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create apps table
CREATE TABLE IF NOT EXISTS public.prototypes (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  stage public.prototype_stage NOT NULL DEFAULT 'Concept'::prototype_stage,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT prototypes_pkey PRIMARY KEY (id)
);

-- Create index for stage
CREATE INDEX IF NOT EXISTS idx_prototypes_stage ON public.prototypes USING btree (stage);

-- Enable Row Level Security
ALTER TABLE public.prototypes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for apps table
DROP POLICY IF EXISTS "Users can view prototypes" ON public.prototypes;
CREATE POLICY "Users can view prototypes"
  ON public.prototypes
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_prototypes_updated_at ON public.prototypes;
CREATE TRIGGER update_prototypes_updated_at
  BEFORE UPDATE ON public.prototypes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
