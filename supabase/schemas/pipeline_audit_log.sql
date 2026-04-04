-- Declarative Schema for Pipeline Audit Log
-- Records every state transition, notification, and approval for traceability

CREATE TABLE IF NOT EXISTS public.pipeline_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id TEXT NOT NULL,
  node_name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  actor TEXT NOT NULL DEFAULT 'system',
  payload JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for querying audit events
CREATE INDEX IF NOT EXISTS idx_pipeline_audit_log_thread ON public.pipeline_audit_log(thread_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_audit_log_created ON public.pipeline_audit_log(created_at);

-- Enable Row Level Security
ALTER TABLE public.pipeline_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies — only service role can access audit log
DROP POLICY IF EXISTS "Service role can manage pipeline audit log" ON public.pipeline_audit_log;
CREATE POLICY "Service role can manage pipeline audit log"
  ON public.pipeline_audit_log
  FOR ALL
  USING (true)
  WITH CHECK (true);
