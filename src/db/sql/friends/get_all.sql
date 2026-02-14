SELECT 
  f.id,
  f.user_id,
  f.friend_id,
  f.created_at,
  f.updated_at
FROM public.friends f
WHERE f.user_id = $1
ORDER BY f.created_at DESC;
