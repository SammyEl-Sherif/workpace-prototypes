SELECT
  id,
  name,
  domain,
  created_at,
  updated_at
FROM public.organizations
WHERE id = $1
LIMIT 1;
