INSERT INTO public.pipeline_audit_log (thread_id, node_name, event_type, actor, payload)
VALUES ($1, $2, $3, $4, $5::JSONB)
RETURNING *;
