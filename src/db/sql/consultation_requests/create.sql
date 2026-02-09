INSERT INTO public.consultation_requests (
  name,
  email,
  company,
  service,
  budget,
  timeline,
  message
)
VALUES (
  $1,  -- name
  $2,  -- email
  $3,  -- company (nullable)
  $4,  -- service
  $5,  -- budget (nullable)
  $6,  -- timeline (nullable)
  $7   -- message (nullable)
)
RETURNING *;
