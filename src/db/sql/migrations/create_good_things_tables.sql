-- Migration: Create goals and good_things tables
-- Run this in Supabase SQL Editor

-- Create goals table
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT goals_name_not_empty CHECK (char_length(trim(name)) > 0)
);

-- Create good_things table
CREATE TABLE IF NOT EXISTS public.good_things (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_id UUID REFERENCES public.goals(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  completion_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT good_things_title_not_empty CHECK (char_length(trim(title)) > 0)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON public.goals(user_id);
CREATE INDEX IF NOT EXISTS idx_good_things_user_id ON public.good_things(user_id);
CREATE INDEX IF NOT EXISTS idx_good_things_goal_id ON public.good_things(goal_id);
CREATE INDEX IF NOT EXISTS idx_good_things_completion_date ON public.good_things(completion_date);

-- Enable Row Level Security
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.good_things ENABLE ROW LEVEL SECURITY;

-- RLS Policies for goals table
-- Users can only see their own goals
CREATE POLICY "Users can view their own goals"
  ON public.goals
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own goals
CREATE POLICY "Users can insert their own goals"
  ON public.goals
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own goals
CREATE POLICY "Users can update their own goals"
  ON public.goals
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own goals
CREATE POLICY "Users can delete their own goals"
  ON public.goals
  FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for good_things table
-- Users can only see their own good things
CREATE POLICY "Users can view their own good things"
  ON public.good_things
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own good things
CREATE POLICY "Users can insert their own good things"
  ON public.good_things
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own good things
CREATE POLICY "Users can update their own good things"
  ON public.good_things
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own good things
CREATE POLICY "Users can delete their own good things"
  ON public.good_things
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_goals_updated_at
  BEFORE UPDATE ON public.goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_good_things_updated_at
  BEFORE UPDATE ON public.good_things
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
