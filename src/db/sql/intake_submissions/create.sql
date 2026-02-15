INSERT INTO public.intake_submissions (org_id, submitted_by, status, company_info, tools_tech, goals_needs, submitted_at)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING
  id,
  org_id,
  submitted_by,
  status::text,
  company_info,
  tools_tech,
  goals_needs,
  submitted_at,
  created_at,
  updated_at;
