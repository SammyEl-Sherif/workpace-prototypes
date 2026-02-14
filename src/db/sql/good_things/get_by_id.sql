SELECT 
  gt.id,
  gt.user_id,
  gt.goal_id,
  gt.challenge_id,
  gt.title,
  gt.description,
  gt.completion_date,
  gt.created_at,
  gt.updated_at,
  g.name as goal_name
FROM public.good_things gt
LEFT JOIN public.goals g ON gt.goal_id = g.id
WHERE gt.id = $1 AND gt.user_id = $2;
