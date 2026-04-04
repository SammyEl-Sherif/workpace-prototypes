INSERT INTO public.change_requests (org_id, submitted_by, title, description, category, priority)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING
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
  updated_at;
