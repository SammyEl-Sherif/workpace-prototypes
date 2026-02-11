-- Delete a challenge (only if user is the creator)
DELETE FROM public.challenges
WHERE id = $1 AND creator_user_id = $2
RETURNING *;
