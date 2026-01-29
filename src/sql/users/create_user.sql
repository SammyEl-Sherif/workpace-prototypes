INSERT INTO public.users (
  auth0_user_id,
  email,
  email_verified,
  name,
  given_name,
  family_name,
  picture_url,
  is_active,
  blocked,
  last_login_at,
  app_metadata,
  user_metadata
)
VALUES (
  $1,  -- auth0_user_id
  $2,  -- email
  COALESCE($3, false),  -- email_verified
  $4,  -- name
  $5,  -- given_name
  $6,  -- family_name
  $7,  -- picture_url
  COALESCE($8, true),  -- is_active
  COALESCE($9, false),  -- blocked
  $10, -- last_login_at
  COALESCE($11, '{}'::jsonb),  -- app_metadata
  COALESCE($12, '{}'::jsonb)   -- user_metadata
)
RETURNING *;

