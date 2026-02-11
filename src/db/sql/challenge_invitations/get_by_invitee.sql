-- Get all pending invitations for a user
SELECT 
  ci.*,
  c.name as challenge_name,
  u1.email as inviter_email
FROM public.challenge_invitations ci
LEFT JOIN public.challenges c ON ci.challenge_id = c.id
LEFT JOIN auth.users u1 ON ci.inviter_user_id = u1.id
WHERE ci.invitee_user_id = $1 AND ci.status = 'pending'
ORDER BY ci.created_at DESC;
