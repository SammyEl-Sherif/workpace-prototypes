UPDATE public.feature_flags
SET
  enabled = NOT enabled,
  updated_by = $2
WHERE id = $1
RETURNING id, key, name, description, enabled, created_by, updated_by, created_at, updated_at;
