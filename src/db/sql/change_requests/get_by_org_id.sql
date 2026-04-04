SELECT
  id,
  org_id,
  submitted_by,
  title,
  description,
  category::text,
  priority::text,
  status::text,
  admin_notes,
  created_at,
  updated_at
FROM public.change_requests
WHERE org_id = $1
ORDER BY created_at DESC;
