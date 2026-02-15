INSERT INTO public.pipeline_threads (thread_id, client_email, client_phone, org_id, envelope_id, notion_page_id, status)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *;
