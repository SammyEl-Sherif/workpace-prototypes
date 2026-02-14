DELETE FROM public.friends
WHERE user_id = $1 AND friend_id = $2
RETURNING *;
