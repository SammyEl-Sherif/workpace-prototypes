INSERT INTO public.friends (user_id, friend_id)
VALUES ($1, $2)
RETURNING *;
