SELECT
  id,
  org_id,
  access_token,
  refresh_token,
  token_expires_at,
  account_id,
  base_uri,
  connected_by,
  created_at,
  updated_at
FROM public.docusign_connections
WHERE org_id = $1;
