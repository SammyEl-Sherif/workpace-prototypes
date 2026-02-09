SELECT
  id,
  key,
  name,
  description,
  enabled,
  created_by,
  updated_by,
  created_at,
  updated_at
FROM public.feature_flags
WHERE key = $1
LIMIT 1;
