SELECT
  id,
  user_id,
  org_id,
  role::text AS role,
  status::text AS status,
  created_at,
  updated_at
FROM public.portal_users
WHERE user_id = $1
LIMIT 1;
