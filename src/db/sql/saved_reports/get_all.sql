SELECT 
  id,
  user_id,
  title,
  content,
  format,
  prompt_used,
  created_at,
  updated_at
FROM public.saved_reports
WHERE user_id = $1
ORDER BY created_at DESC;
