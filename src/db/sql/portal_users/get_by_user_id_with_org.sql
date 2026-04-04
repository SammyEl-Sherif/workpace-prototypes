SELECT
  pu.id,
  pu.user_id,
  pu.org_id,
  pu.role::text AS role,
  pu.status::text AS status,
  pu.created_at,
  pu.updated_at,
  o.name AS org_name,
  o.domain AS org_domain
FROM public.portal_users pu
JOIN public.organizations o ON o.id = pu.org_id
WHERE pu.user_id = $1
LIMIT 1;
