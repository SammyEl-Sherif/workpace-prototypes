SELECT *
FROM public.pipeline_threads
WHERE status = 'active'
  AND (
    ($1::TEXT IS NOT NULL AND client_email = $1)
    OR ($2::TEXT IS NOT NULL AND org_id = $2::UUID)
    OR ($3::TEXT IS NOT NULL AND envelope_id = $3)
  )
ORDER BY created_at DESC
LIMIT 1;
