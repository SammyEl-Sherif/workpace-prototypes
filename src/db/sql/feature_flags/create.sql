INSERT INTO public.feature_flags (key, name, description, enabled, created_by, updated_by)
VALUES ($1, $2, $3, $4, $5, $5)
RETURNING id, key, name, description, enabled, created_by, updated_by, created_at, updated_at;
