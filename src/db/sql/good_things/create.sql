INSERT INTO public.good_things (
  user_id,
  goal_id,
  challenge_id,
  title,
  description,
  completion_date
)
VALUES (
  $1,  -- user_id
  $2,  -- goal_id (nullable)
  $3,  -- challenge_id (nullable)
  $4,  -- title
  $5,  -- description (nullable)
  $6   -- completion_date (nullable)
)
RETURNING *;
