UPDATE public.good_things
SET 
  goal_id = $3,
  title = $4,
  description = $5,
  completion_date = $6,
  updated_at = NOW()
WHERE id = $1 AND user_id = $2
RETURNING *;
