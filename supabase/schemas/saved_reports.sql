-- Declarative Schema for Saved Reports Feature
-- This file defines the desired final state of the database schema

-- Saved reports table
CREATE TABLE IF NOT EXISTS public.saved_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  format TEXT NOT NULL DEFAULT 'markdown' CHECK (format IN ('markdown', 'plaintext')),
  prompt_used TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT saved_reports_title_not_empty CHECK (char_length(trim(title)) > 0),
  CONSTRAINT saved_reports_content_not_empty CHECK (char_length(trim(content)) > 0)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_saved_reports_user_id ON public.saved_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_reports_created_at ON public.saved_reports(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.saved_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for saved_reports table
DROP POLICY IF EXISTS "Users can view their own saved reports" ON public.saved_reports;
CREATE POLICY "Users can view their own saved reports"
  ON public.saved_reports
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own saved reports" ON public.saved_reports;
CREATE POLICY "Users can insert their own saved reports"
  ON public.saved_reports
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own saved reports" ON public.saved_reports;
CREATE POLICY "Users can update their own saved reports"
  ON public.saved_reports
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own saved reports" ON public.saved_reports;
CREATE POLICY "Users can delete their own saved reports"
  ON public.saved_reports
  FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_saved_reports_updated_at ON public.saved_reports;
CREATE TRIGGER update_saved_reports_updated_at
  BEFORE UPDATE ON public.saved_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
