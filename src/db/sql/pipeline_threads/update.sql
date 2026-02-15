UPDATE public.pipeline_threads
SET
  org_id = COALESCE($2::UUID, org_id),
  envelope_id = COALESCE($3, envelope_id),
  notion_page_id = COALESCE($4, notion_page_id),
  status = COALESCE($5, status),
  updated_at = now()
WHERE thread_id = $1
RETURNING *;
