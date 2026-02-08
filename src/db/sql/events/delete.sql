DELETE FROM public.events
WHERE id = $1
  AND creator_user_id = $2
RETURNING *;
