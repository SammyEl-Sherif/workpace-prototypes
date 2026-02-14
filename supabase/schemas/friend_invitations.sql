-- Declarative Schema for Friend Invitations Feature
-- This file defines the desired final state for friend invitations
-- NOTE: update_updated_at_column() is defined in _functions.sql

-- Create enum type for friend invitation status
DO $$ BEGIN
  CREATE TYPE public.friend_invitation_status AS ENUM ('pending', 'accepted', 'declined');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Friend invitations table: tracks friend requests
CREATE TABLE IF NOT EXISTS public.friend_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invitee_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status public.friend_invitation_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Prevent duplicate invitations
  CONSTRAINT friend_invitations_unique UNIQUE (inviter_user_id, invitee_user_id),
  -- Prevent users from inviting themselves
  CONSTRAINT friend_invitations_no_self_reference CHECK (inviter_user_id != invitee_user_id)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_friend_invitations_inviter_user_id ON public.friend_invitations(inviter_user_id);
CREATE INDEX IF NOT EXISTS idx_friend_invitations_invitee_user_id ON public.friend_invitations(invitee_user_id);
CREATE INDEX IF NOT EXISTS idx_friend_invitations_status ON public.friend_invitations(status);

-- Enable Row Level Security
ALTER TABLE public.friend_invitations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for friend_invitations table
CREATE POLICY "Users can view their own invitations"
  ON public.friend_invitations
  FOR SELECT
  USING (inviter_user_id = auth.uid() OR invitee_user_id = auth.uid());

CREATE POLICY "Users can create invitations"
  ON public.friend_invitations
  FOR INSERT
  WITH CHECK (inviter_user_id = auth.uid());

CREATE POLICY "Invited users can update their invitation status"
  ON public.friend_invitations
  FOR UPDATE
  USING (invitee_user_id = auth.uid())
  WITH CHECK (invitee_user_id = auth.uid());

CREATE POLICY "Users can delete their own invitations"
  ON public.friend_invitations
  FOR DELETE
  USING (inviter_user_id = auth.uid() OR invitee_user_id = auth.uid());

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_friend_invitations_updated_at ON public.friend_invitations;
CREATE TRIGGER update_friend_invitations_updated_at
  BEFORE UPDATE ON public.friend_invitations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
