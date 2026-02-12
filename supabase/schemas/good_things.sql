-- Declarative Schema for Good Things List Feature
-- This file defines the desired final state of the database schema
-- NOTE: update_updated_at_column() is defined in _functions.sql
-- NOTE: goals table is defined in goals.sql

-- Good things table
CREATE TABLE IF NOT EXISTS public.good_things (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_id UUID REFERENCES public.goals(id) ON DELETE SET NULL,
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  completion_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT good_things_title_not_empty CHECK (char_length(trim(title)) > 0)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_good_things_user_id ON public.good_things(user_id);
CREATE INDEX IF NOT EXISTS idx_good_things_goal_id ON public.good_things(goal_id);
CREATE INDEX IF NOT EXISTS idx_good_things_challenge_id ON public.good_things(challenge_id);
CREATE INDEX IF NOT EXISTS idx_good_things_completion_date ON public.good_things(completion_date);

-- Enable Row Level Security
ALTER TABLE public.good_things ENABLE ROW LEVEL SECURITY;

-- RLS Policies for good_things table
DROP POLICY IF EXISTS "Users can view their own good things" ON public.good_things;
CREATE POLICY "Users can view their own good things"
  ON public.good_things
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own good things" ON public.good_things;
CREATE POLICY "Users can insert their own good things"
  ON public.good_things
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own good things" ON public.good_things;
CREATE POLICY "Users can update their own good things"
  ON public.good_things
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own good things" ON public.good_things;
CREATE POLICY "Users can delete their own good things"
  ON public.good_things
  FOR DELETE
  USING (auth.uid() = user_id);

-- Triggers to automatically update updated_at
DROP TRIGGER IF EXISTS update_good_things_updated_at ON public.good_things;
CREATE TRIGGER update_good_things_updated_at
  BEFORE UPDATE ON public.good_things
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
