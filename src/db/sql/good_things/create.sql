INSERT INTO public.good_things (
  user_id,
  goal_id,
  title,
  description,
  completion_date
)
VALUES (
  $1,  -- user_id
  $2,  -- goal_id (nullable)
  $3,  -- title
  $4,  -- description (nullable)
  $5   -- completion_date (nullable)
)
RETURNING *;
