-- Declarative Schema for Friends Feature
-- This file defines the desired final state of the friends table
-- NOTE: update_updated_at_column() is defined in _functions.sql

-- Friends table: many-to-many relationship between users
CREATE TABLE IF NOT EXISTS public.friends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Prevent duplicate friendships
  CONSTRAINT friends_unique_pair UNIQUE (user_id, friend_id),
  -- Prevent users from adding themselves as friends
  CONSTRAINT friends_no_self_reference CHECK (user_id != friend_id)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_friends_user_id ON public.friends(user_id);
CREATE INDEX IF NOT EXISTS idx_friends_friend_id ON public.friends(friend_id);

-- Enable Row Level Security
ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;

-- RLS Policies for friends table
DROP POLICY IF EXISTS "Users can view their own friends" ON public.friends;
CREATE POLICY "Users can view their own friends"
  ON public.friends
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can add their own friends" ON public.friends;
CREATE POLICY "Users can add their own friends"
  ON public.friends
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can remove their own friends" ON public.friends;
CREATE POLICY "Users can remove their own friends"
  ON public.friends
  FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_friends_updated_at ON public.friends;
CREATE TRIGGER update_friends_updated_at
  BEFORE UPDATE ON public.friends
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
