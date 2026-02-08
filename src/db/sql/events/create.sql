INSERT INTO public.events (
  creator_user_id,
  title,
  description,
  starts_at,
  location
)
VALUES (
  $1,  -- creator_user_id
  $2,  -- title
  $3,  -- description (nullable)
  $4,  -- starts_at
  $5   -- location (nullable)
)
RETURNING *;
