INSERT INTO public.docusign_connections (
  org_id, access_token, refresh_token, token_expires_at, account_id, base_uri, connected_by
)
VALUES ($1, $2, $3, $4, $5, $6, $7)
ON CONFLICT (org_id) DO UPDATE SET
  access_token = EXCLUDED.access_token,
  refresh_token = EXCLUDED.refresh_token,
  token_expires_at = EXCLUDED.token_expires_at,
  account_id = EXCLUDED.account_id,
  base_uri = EXCLUDED.base_uri,
  connected_by = EXCLUDED.connected_by,
  updated_at = NOW()
RETURNING
  id,
  org_id,
  access_token,
  refresh_token,
  token_expires_at,
  account_id,
  base_uri,
  connected_by,
  created_at,
  updated_at;
