DELETE FROM public.feature_flags
WHERE id = $1
RETURNING id;
