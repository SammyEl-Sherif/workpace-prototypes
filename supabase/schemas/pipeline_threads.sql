-- Declarative Schema for Pipeline Threads
-- Maps external identifiers to LangGraph thread IDs for webhook resolution
-- NOTE: update_updated_at_column() is defined in _functions.sql
-- NOTE: organizations table is defined in organizations.sql

CREATE TABLE IF NOT EXISTS public.pipeline_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id TEXT NOT NULL UNIQUE,
  client_email TEXT,
  client_phone TEXT,
  org_id UUID REFERENCES public.organizations(id),
  envelope_id TEXT,
  notion_page_id TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for webhook lookups
CREATE INDEX IF NOT EXISTS idx_pipeline_threads_email ON public.pipeline_threads(client_email);
CREATE INDEX IF NOT EXISTS idx_pipeline_threads_org ON public.pipeline_threads(org_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_threads_envelope ON public.pipeline_threads(envelope_id);

-- Enable Row Level Security
ALTER TABLE public.pipeline_threads ENABLE ROW LEVEL SECURITY;

-- RLS Policies — only service role can access pipeline threads
DROP POLICY IF EXISTS "Service role can manage pipeline threads" ON public.pipeline_threads;
CREATE POLICY "Service role can manage pipeline threads"
  ON public.pipeline_threads
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_pipeline_threads_updated_at ON public.pipeline_threads;
CREATE TRIGGER update_pipeline_threads_updated_at
  BEFORE UPDATE ON public.pipeline_threads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
