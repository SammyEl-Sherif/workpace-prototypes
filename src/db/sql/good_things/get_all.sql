SELECT 
  gt.id,
  gt.user_id,
  gt.goal_id,
  gt.title,
  gt.description,
  gt.completion_date,
  gt.created_at,
  gt.updated_at,
  g.name as goal_name
FROM public.good_things gt
LEFT JOIN public.goals g ON gt.goal_id = g.id
WHERE gt.user_id = $1
ORDER BY gt.completion_date DESC NULLS LAST, gt.created_at DESC;
