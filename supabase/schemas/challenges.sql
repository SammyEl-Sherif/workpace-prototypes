-- Declarative Schema for Challenges Feature
-- This file defines the desired final state of the challenges tables
-- NOTE: update_updated_at_column() is defined in _functions.sql

-- Create enum type for challenge invitation status
DO $$ BEGIN
  CREATE TYPE public.challenge_invitation_status AS ENUM ('pending', 'accepted', 'declined');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Challenges table: created by a user with goal, duration, and task
CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration_days INTEGER NOT NULL CHECK (duration_days > 0),
  task_description TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT challenges_name_not_empty CHECK (char_length(trim(name)) > 0),
  CONSTRAINT challenges_task_not_empty CHECK (char_length(trim(task_description)) > 0),
  CONSTRAINT challenges_end_after_start CHECK (end_date >= start_date)
);

-- Challenge participants table: users who are part of a challenge
CREATE TABLE IF NOT EXISTS public.challenge_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Prevent duplicate participants
  CONSTRAINT challenge_participants_unique UNIQUE (challenge_id, user_id)
);

-- Challenge invitations table: tracks invitations sent to friends
CREATE TABLE IF NOT EXISTS public.challenge_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  inviter_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invitee_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status public.challenge_invitation_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Prevent duplicate invitations
  CONSTRAINT challenge_invitations_unique UNIQUE (challenge_id, invitee_user_id),
  -- Prevent users from inviting themselves
  CONSTRAINT challenge_invitations_no_self_reference CHECK (inviter_user_id != invitee_user_id)
);

-- Challenge evidence table: daily evidence uploads from participants
CREATE TABLE IF NOT EXISTS public.challenge_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  participant_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  evidence_date DATE NOT NULL,
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('photo', 'video')),
  media_url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_size_bytes BIGINT,
  mime_type TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Prevent duplicate evidence for same day
  CONSTRAINT challenge_evidence_unique_per_day UNIQUE (challenge_id, participant_user_id, evidence_date)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_challenges_creator_user_id ON public.challenges(creator_user_id);
CREATE INDEX IF NOT EXISTS idx_challenges_goal_id ON public.challenges(goal_id);
CREATE INDEX IF NOT EXISTS idx_challenges_start_date ON public.challenges(start_date);
CREATE INDEX IF NOT EXISTS idx_challenges_end_date ON public.challenges(end_date);
CREATE INDEX IF NOT EXISTS idx_challenge_participants_challenge_id ON public.challenge_participants(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_participants_user_id ON public.challenge_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_invitations_challenge_id ON public.challenge_invitations(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_invitations_inviter_user_id ON public.challenge_invitations(inviter_user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_invitations_invitee_user_id ON public.challenge_invitations(invitee_user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_invitations_status ON public.challenge_invitations(status);
CREATE INDEX IF NOT EXISTS idx_challenge_evidence_challenge_id ON public.challenge_evidence(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_evidence_participant_user_id ON public.challenge_evidence(participant_user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_evidence_evidence_date ON public.challenge_evidence(evidence_date);

-- Enable Row Level Security
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_evidence ENABLE ROW LEVEL SECURITY;

-- RLS Policies for challenges table
DROP POLICY IF EXISTS "Users can view challenges they participate in" ON public.challenges;
CREATE POLICY "Users can view challenges they participate in"
  ON public.challenges
  FOR SELECT
  USING (
    creator_user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.challenge_participants
      WHERE challenge_id = challenges.id AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can create challenges" ON public.challenges;
CREATE POLICY "Users can create challenges"
  ON public.challenges
  FOR INSERT
  WITH CHECK (auth.uid() = creator_user_id);

DROP POLICY IF EXISTS "Users can update challenges they created" ON public.challenges;
CREATE POLICY "Users can update challenges they created"
  ON public.challenges
  FOR UPDATE
  USING (auth.uid() = creator_user_id)
  WITH CHECK (auth.uid() = creator_user_id);

DROP POLICY IF EXISTS "Users can delete challenges they created" ON public.challenges;
CREATE POLICY "Users can delete challenges they created"
  ON public.challenges
  FOR DELETE
  USING (auth.uid() = creator_user_id);

-- RLS Policies for challenge_participants table
DROP POLICY IF EXISTS "Users can view participants in their challenges" ON public.challenge_participants;
CREATE POLICY "Users can view participants in their challenges"
  ON public.challenge_participants
  FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.challenges
      WHERE id = challenge_participants.challenge_id AND creator_user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.challenge_participants cp
      WHERE cp.challenge_id = challenge_participants.challenge_id AND cp.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can join challenges" ON public.challenge_participants;
CREATE POLICY "Users can join challenges"
  ON public.challenge_participants
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can leave challenges" ON public.challenge_participants;
CREATE POLICY "Users can leave challenges"
  ON public.challenge_participants
  FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for challenge_invitations table
DROP POLICY IF EXISTS "Users can view invitations they sent or received" ON public.challenge_invitations;
CREATE POLICY "Users can view invitations they sent or received"
  ON public.challenge_invitations
  FOR SELECT
  USING (auth.uid() = inviter_user_id OR auth.uid() = invitee_user_id);

DROP POLICY IF EXISTS "Users can create invitations" ON public.challenge_invitations;
CREATE POLICY "Users can create invitations"
  ON public.challenge_invitations
  FOR INSERT
  WITH CHECK (auth.uid() = inviter_user_id);

DROP POLICY IF EXISTS "Users can update invitations they received" ON public.challenge_invitations;
CREATE POLICY "Users can update invitations they received"
  ON public.challenge_invitations
  FOR UPDATE
  USING (auth.uid() = invitee_user_id)
  WITH CHECK (auth.uid() = invitee_user_id);

-- RLS Policies for challenge_evidence table
DROP POLICY IF EXISTS "Users can view evidence in challenges they participate in" ON public.challenge_evidence;
CREATE POLICY "Users can view evidence in challenges they participate in"
  ON public.challenge_evidence
  FOR SELECT
  USING (
    participant_user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.challenge_participants
      WHERE challenge_id = challenge_evidence.challenge_id AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can upload their own evidence" ON public.challenge_evidence;
CREATE POLICY "Users can upload their own evidence"
  ON public.challenge_evidence
  FOR INSERT
  WITH CHECK (
    auth.uid() = participant_user_id AND
    EXISTS (
      SELECT 1 FROM public.challenge_participants
      WHERE challenge_id = challenge_evidence.challenge_id AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update their own evidence" ON public.challenge_evidence;
CREATE POLICY "Users can update their own evidence"
  ON public.challenge_evidence
  FOR UPDATE
  USING (auth.uid() = participant_user_id)
  WITH CHECK (auth.uid() = participant_user_id);

DROP POLICY IF EXISTS "Users can delete their own evidence" ON public.challenge_evidence;
CREATE POLICY "Users can delete their own evidence"
  ON public.challenge_evidence
  FOR DELETE
  USING (auth.uid() = participant_user_id);

-- Triggers to automatically update updated_at
DROP TRIGGER IF EXISTS update_challenges_updated_at ON public.challenges;
CREATE TRIGGER update_challenges_updated_at
  BEFORE UPDATE ON public.challenges
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_challenge_participants_updated_at ON public.challenge_participants;
CREATE TRIGGER update_challenge_participants_updated_at
  BEFORE UPDATE ON public.challenge_participants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_challenge_invitations_updated_at ON public.challenge_invitations;
CREATE TRIGGER update_challenge_invitations_updated_at
  BEFORE UPDATE ON public.challenge_invitations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
