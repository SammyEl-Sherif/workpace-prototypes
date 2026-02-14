-- Create a new challenge
INSERT INTO public.challenges (
  creator_user_id,
  goal_id,
  name,
  description,
  duration_days,
  task_description,
  start_date,
  end_date
)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING *;
