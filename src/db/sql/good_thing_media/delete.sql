DELETE FROM public.good_thing_media
WHERE id = $1
  AND user_id = $2
RETURNING *;
