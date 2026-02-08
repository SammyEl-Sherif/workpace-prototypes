SELECT
  e.id,
  e.creator_user_id,
  e.title,
  e.description,
  e.starts_at,
  e.location,
  e.created_at,
  e.updated_at
FROM public.events e
WHERE e.id = $1
  AND e.creator_user_id = $2;
