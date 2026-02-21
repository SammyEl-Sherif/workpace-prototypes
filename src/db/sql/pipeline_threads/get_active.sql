SELECT *
FROM public.pipeline_threads
WHERE status = 'active'
ORDER BY updated_at DESC;
