SELECT
  gt.id,
  gt.user_id,
  gt.goal_id,
  gt.title,
  gt.description,
  gt.completion_date,
  gt.created_at,
  gt.updated_at,
  g.name AS goal_name
FROM public.good_things gt
LEFT JOIN public.goals g ON gt.goal_id = g.id
WHERE gt.user_id = $1
  AND gt.created_at >= $2::timestamptz
  AND gt.created_at < $3::timestamptz
ORDER BY gt.created_at DESC;
