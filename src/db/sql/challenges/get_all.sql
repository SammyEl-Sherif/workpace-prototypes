-- Get all challenges where the user is a creator or participant
SELECT 
  c.*,
  g.name as goal_name,
  COUNT(DISTINCT cp.user_id) as participant_count
FROM public.challenges c
LEFT JOIN public.goals g ON c.goal_id = g.id
LEFT JOIN public.challenge_participants cp ON c.id = cp.challenge_id
WHERE 
  c.creator_user_id = $1 OR
  EXISTS (
    SELECT 1 FROM public.challenge_participants
    WHERE challenge_id = c.id AND user_id = $1
  )
GROUP BY c.id, g.name
ORDER BY c.created_at DESC;
