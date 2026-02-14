-- Declarative Schema for Chief of Staff Notion Databases
-- This file defines the desired final state for storing user-selected Notion databases
-- NOTE: update_updated_at_column() is defined in _functions.sql

-- Chief of Staff databases table: stores which Notion databases a user wants included in their morning summary
CREATE TABLE IF NOT EXISTS public.chief_of_staff_databases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  database_id TEXT NOT NULL,
  database_title TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Prevent duplicate database selections per user
  CONSTRAINT chief_of_staff_databases_unique UNIQUE (user_id, database_id)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_chief_of_staff_databases_user_id ON public.chief_of_staff_databases(user_id);
CREATE INDEX IF NOT EXISTS idx_chief_of_staff_databases_database_id ON public.chief_of_staff_databases(database_id);

-- Enable Row Level Security
ALTER TABLE public.chief_of_staff_databases ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chief_of_staff_databases table
DROP POLICY IF EXISTS "Users can view their own databases" ON public.chief_of_staff_databases;
CREATE POLICY "Users can view their own databases"
  ON public.chief_of_staff_databases
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own databases" ON public.chief_of_staff_databases;
CREATE POLICY "Users can insert their own databases"
  ON public.chief_of_staff_databases
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own databases" ON public.chief_of_staff_databases;
CREATE POLICY "Users can update their own databases"
  ON public.chief_of_staff_databases
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own databases" ON public.chief_of_staff_databases;
CREATE POLICY "Users can delete their own databases"
  ON public.chief_of_staff_databases
  FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_chief_of_staff_databases_updated_at ON public.chief_of_staff_databases;
CREATE TRIGGER update_chief_of_staff_databases_updated_at
  BEFORE UPDATE ON public.chief_of_staff_databases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
