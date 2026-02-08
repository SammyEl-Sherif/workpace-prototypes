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
WHERE e.creator_user_id = $1
ORDER BY e.starts_at DESC, e.created_at DESC;
