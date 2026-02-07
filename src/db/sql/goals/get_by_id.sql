SELECT 
  id,
  user_id,
  name,
  created_at,
  updated_at
FROM public.goals
WHERE id = $1 AND user_id = $2;
