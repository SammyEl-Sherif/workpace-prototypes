-- Update a challenge (only if user is the creator)
UPDATE public.challenges
SET 
  name = COALESCE($3, name),
  description = COALESCE($4, description),
  task_description = COALESCE($5, task_description),
  updated_at = NOW()
WHERE id = $1 AND creator_user_id = $2
RETURNING *;
