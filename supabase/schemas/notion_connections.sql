-- Declarative Schema for Notion OAuth Connections
-- This file defines the desired final state for storing user Notion OAuth tokens
-- NOTE: update_updated_at_column() is defined in _functions.sql

-- Notion connections table
CREATE TABLE IF NOT EXISTS public.notion_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  workspace_id TEXT,
  workspace_name TEXT,
  bot_id TEXT,
  notion_user_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT notion_connections_user_id_unique UNIQUE (user_id)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_notion_connections_user_id ON public.notion_connections(user_id);

-- Enable Row Level Security
ALTER TABLE public.notion_connections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notion_connections table
DROP POLICY IF EXISTS "Users can view their own connections" ON public.notion_connections;
CREATE POLICY "Users can view their own connections"
  ON public.notion_connections
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own connections" ON public.notion_connections;
CREATE POLICY "Users can insert their own connections"
  ON public.notion_connections
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own connections" ON public.notion_connections;
CREATE POLICY "Users can update their own connections"
  ON public.notion_connections
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own connections" ON public.notion_connections;
CREATE POLICY "Users can delete their own connections"
  ON public.notion_connections
  FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_notion_connections_updated_at ON public.notion_connections;
CREATE TRIGGER update_notion_connections_updated_at
  BEFORE UPDATE ON public.notion_connections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
