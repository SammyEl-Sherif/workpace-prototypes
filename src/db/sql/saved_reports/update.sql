UPDATE public.saved_reports
SET 
  title = $3,
  content = $4,
  format = $5,
  prompt_used = $6,
  updated_at = NOW()
WHERE id = $1 AND user_id = $2
RETURNING *;
