UPDATE public.portal_users
SET status = $2::public.portal_user_status
WHERE id = $1
RETURNING *;
