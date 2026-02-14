-- Get all participants for a challenge
SELECT 
  cp.*,
  u.email as user_email
FROM public.challenge_participants cp
LEFT JOIN auth.users u ON cp.user_id = u.id
WHERE cp.challenge_id = $1
ORDER BY cp.joined_at ASC;
