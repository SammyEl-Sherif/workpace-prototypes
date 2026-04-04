SELECT *
FROM public.pipeline_audit_log
WHERE thread_id = $1
ORDER BY created_at ASC;
