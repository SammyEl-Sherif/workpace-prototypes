DELETE FROM public.goals
WHERE id = $1 AND user_id = $2
RETURNING *;
