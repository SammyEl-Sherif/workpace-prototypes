UPDATE public.intake_submissions
SET
  status = $2,
  company_info = COALESCE($3, company_info),
  tools_tech = COALESCE($4, tools_tech),
  goals_needs = COALESCE($5, goals_needs),
  submitted_at = CASE WHEN $2 = 'submitted' AND submitted_at IS NULL THEN NOW() ELSE submitted_at END
WHERE org_id = $1
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
