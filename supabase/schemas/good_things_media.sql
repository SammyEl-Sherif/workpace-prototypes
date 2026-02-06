-- Declarative Schema for Good Thing Media Feature
-- This file defines the desired final state for media attachments on good things
-- NOTE: This file is named good_things_media.sql (not good_thing_media.sql)
-- so it sorts AFTER good_things.sql which it depends on.

-- Good thing media table
CREATE TABLE IF NOT EXISTS public.good_thing_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  good_thing_id UUID NOT NULL REFERENCES public.good_things(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('photo', 'video')),
  media_url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_size_bytes BIGINT,
  mime_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_good_thing_media_good_thing_id ON public.good_thing_media(good_thing_id);
CREATE INDEX IF NOT EXISTS idx_good_thing_media_user_id ON public.good_thing_media(user_id);

-- Enable Row Level Security
ALTER TABLE public.good_thing_media ENABLE ROW LEVEL SECURITY;

-- RLS Policies for good_thing_media table
DROP POLICY IF EXISTS "Users can view their own media" ON public.good_thing_media;
CREATE POLICY "Users can view their own media"
  ON public.good_thing_media
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own media" ON public.good_thing_media;
CREATE POLICY "Users can insert their own media"
  ON public.good_thing_media
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own media" ON public.good_thing_media;
CREATE POLICY "Users can delete their own media"
  ON public.good_thing_media
  FOR DELETE
  USING (auth.uid() = user_id);
