SELECT 
  id,
  user_id,
  name,
  created_at,
  updated_at
FROM public.goals
WHERE user_id = $1
ORDER BY created_at DESC;
