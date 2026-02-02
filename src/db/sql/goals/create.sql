INSERT INTO public.goals (
  user_id,
  name
)
VALUES (
  $1,  -- user_id
  $2   -- name
)
RETURNING *;
