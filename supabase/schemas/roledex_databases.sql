-- Declarative Schema for Roledex Notion Databases
-- This file defines the desired final state for storing user-selected Notion contact databases
-- NOTE: update_updated_at_column() is defined in _functions.sql

-- Roledex databases table: stores which Notion database a user wants to use for contact management
CREATE TABLE IF NOT EXISTS public.roledex_databases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  database_id TEXT NOT NULL,
  database_title TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Prevent duplicate database selections per user
  CONSTRAINT roledex_databases_unique UNIQUE (user_id, database_id)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_roledex_databases_user_id ON public.roledex_databases(user_id);
CREATE INDEX IF NOT EXISTS idx_roledex_databases_database_id ON public.roledex_databases(database_id);

-- Enable Row Level Security
ALTER TABLE public.roledex_databases ENABLE ROW LEVEL SECURITY;

-- RLS Policies for roledex_databases table
DROP POLICY IF EXISTS "Users can view their own roledex databases" ON public.roledex_databases;
CREATE POLICY "Users can view their own roledex databases"
  ON public.roledex_databases
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own roledex databases" ON public.roledex_databases;
CREATE POLICY "Users can insert their own roledex databases"
  ON public.roledex_databases
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own roledex databases" ON public.roledex_databases;
CREATE POLICY "Users can update their own roledex databases"
  ON public.roledex_databases
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own roledex databases" ON public.roledex_databases;
CREATE POLICY "Users can delete their own roledex databases"
  ON public.roledex_databases
  FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_roledex_databases_updated_at ON public.roledex_databases;
CREATE TRIGGER update_roledex_databases_updated_at
  BEFORE UPDATE ON public.roledex_databases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
