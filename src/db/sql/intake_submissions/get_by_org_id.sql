SELECT
  id,
  org_id,
  submitted_by,
  status::text,
  company_info,
  tools_tech,
  goals_needs,
  submitted_at,
  created_at,
  updated_at
FROM public.intake_submissions
WHERE org_id = $1;
