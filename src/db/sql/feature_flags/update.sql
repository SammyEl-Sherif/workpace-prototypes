UPDATE public.feature_flags
SET
  key = COALESCE($2, key),
  name = COALESCE($3, name),
  description = COALESCE($4, description),
  enabled = COALESCE($5, enabled),
  updated_by = $6
WHERE id = $1
RETURNING id, key, name, description, enabled, created_by, updated_by, created_at, updated_at;
