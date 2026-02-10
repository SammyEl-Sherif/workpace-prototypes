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
ORDER BY created_at DESC;
