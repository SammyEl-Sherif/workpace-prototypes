INSERT INTO public.event_guests (
  event_id,
  phone_number,
  name,
  user_id
)
VALUES (
  $1,  -- event_id
  $2,  -- phone_number
  $3,  -- name (nullable)
  $4   -- user_id (nullable)
)
RETURNING *;
