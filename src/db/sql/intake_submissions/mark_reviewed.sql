UPDATE public.intake_submissions
SET status = 'reviewed'
WHERE id = $1
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
