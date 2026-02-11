-- Get a challenge by ID (only if user is creator or participant)
SELECT 
  c.*,
  g.name as goal_name,
  COUNT(DISTINCT cp.user_id) as participant_count
FROM public.challenges c
LEFT JOIN public.goals g ON c.goal_id = g.id
LEFT JOIN public.challenge_participants cp ON c.id = cp.challenge_id
WHERE 
  c.id = $1 AND
  (c.creator_user_id = $2 OR
   EXISTS (
     SELECT 1 FROM public.challenge_participants
     WHERE challenge_id = c.id AND user_id = $2
   ))
GROUP BY c.id, g.name;
