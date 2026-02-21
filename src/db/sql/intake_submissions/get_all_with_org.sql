SELECT
  i.id,
  i.org_id,
  i.submitted_by,
  i.status::text,
  i.company_info,
  i.tools_tech,
  i.goals_needs,
  i.submitted_at,
  i.created_at,
  i.updated_at,
  o.name AS org_name
FROM public.intake_submissions i
JOIN public.organizations o ON o.id = i.org_id
ORDER BY i.submitted_at DESC NULLS LAST;
