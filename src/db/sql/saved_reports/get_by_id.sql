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
WHERE id = $1 AND user_id = $2;
