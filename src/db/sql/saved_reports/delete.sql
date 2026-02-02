DELETE FROM public.saved_reports
WHERE id = $1 AND user_id = $2
RETURNING *;
