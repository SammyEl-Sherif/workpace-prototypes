UPDATE public.events
SET
  title = COALESCE($3, title),
  description = $4,
  starts_at = COALESCE($5, starts_at),
  location = $6
WHERE id = $1
  AND creator_user_id = $2
RETURNING *;
