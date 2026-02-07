DELETE FROM public.good_things
WHERE id = $1 AND user_id = $2
RETURNING *;
