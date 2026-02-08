-- Declarative Schema for Events & Event Guests
-- This file defines the desired final state of the events tables

-- Ensure the shared updated_at trigger function exists
-- (Also defined in good_things.sql; CREATE OR REPLACE keeps it idempotent)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create enum type for invite status
DO $$ BEGIN
  CREATE TYPE public.invite_status AS ENUM ('pending', 'sent', 'bounced', 'confirmed', 'declined');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Events table: created by an authenticated user
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  starts_at TIMESTAMPTZ NOT NULL,
  location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT events_title_not_empty CHECK (char_length(trim(title)) > 0)
);

-- Event guests table: guests may or may not map to auth users
CREATE TABLE IF NOT EXISTS public.event_guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  phone_number TEXT NOT NULL,
  name TEXT,
  invite_status public.invite_status NOT NULL DEFAULT 'pending',
  sms_invite_message_id TEXT,
  last_invite_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT event_guests_phone_not_empty CHECK (char_length(trim(phone_number)) > 0)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_events_creator_user_id ON public.events(creator_user_id);
CREATE INDEX IF NOT EXISTS idx_events_starts_at ON public.events(starts_at);
CREATE INDEX IF NOT EXISTS idx_event_guests_event_id ON public.event_guests(event_id);
CREATE INDEX IF NOT EXISTS idx_event_guests_user_id ON public.event_guests(user_id);
CREATE INDEX IF NOT EXISTS idx_event_guests_invite_status ON public.event_guests(invite_status);

-- Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_guests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for events table
DROP POLICY IF EXISTS "Users can view their own events" ON public.events;
CREATE POLICY "Users can view their own events"
  ON public.events
  FOR SELECT
  USING (auth.uid() = creator_user_id);

DROP POLICY IF EXISTS "Users can insert their own events" ON public.events;
CREATE POLICY "Users can insert their own events"
  ON public.events
  FOR INSERT
  WITH CHECK (auth.uid() = creator_user_id);

DROP POLICY IF EXISTS "Users can update their own events" ON public.events;
CREATE POLICY "Users can update their own events"
  ON public.events
  FOR UPDATE
  USING (auth.uid() = creator_user_id)
  WITH CHECK (auth.uid() = creator_user_id);

DROP POLICY IF EXISTS "Users can delete their own events" ON public.events;
CREATE POLICY "Users can delete their own events"
  ON public.events
  FOR DELETE
  USING (auth.uid() = creator_user_id);

-- RLS Policies for event_guests table
-- Event creators can manage guests for their events
DROP POLICY IF EXISTS "Event creators can view guests" ON public.event_guests;
CREATE POLICY "Event creators can view guests"
  ON public.event_guests
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = event_guests.event_id
      AND events.creator_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Event creators can insert guests" ON public.event_guests;
CREATE POLICY "Event creators can insert guests"
  ON public.event_guests
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = event_guests.event_id
      AND events.creator_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Event creators can update guests" ON public.event_guests;
CREATE POLICY "Event creators can update guests"
  ON public.event_guests
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = event_guests.event_id
      AND events.creator_user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = event_guests.event_id
      AND events.creator_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Event creators can delete guests" ON public.event_guests;
CREATE POLICY "Event creators can delete guests"
  ON public.event_guests
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = event_guests.event_id
      AND events.creator_user_id = auth.uid()
    )
  );

-- Triggers to automatically update updated_at
DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_event_guests_updated_at ON public.event_guests;
CREATE TRIGGER update_event_guests_updated_at
  BEFORE UPDATE ON public.event_guests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
