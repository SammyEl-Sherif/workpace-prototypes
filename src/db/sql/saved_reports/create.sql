INSERT INTO public.saved_reports (
  user_id,
  title,
  content,
  format,
  prompt_used
)
VALUES (
  $1,  -- user_id
  $2,  -- title
  $3,  -- content
  $4,  -- format
  $5   -- prompt_used (nullable)
)
RETURNING *;
