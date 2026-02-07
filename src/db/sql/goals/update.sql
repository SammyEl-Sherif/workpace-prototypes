UPDATE public.goals
SET 
  name = $3,
  updated_at = NOW()
WHERE id = $1 AND user_id = $2
RETURNING *;
