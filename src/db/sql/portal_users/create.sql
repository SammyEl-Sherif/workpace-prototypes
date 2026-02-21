INSERT INTO public.portal_users (user_id, org_id, role, status)
VALUES ($1, $2, $3, $4)
RETURNING *;
