-- Update invitation status (only if user is the invitee)
UPDATE public.challenge_invitations
SET 
  status = $3,
  updated_at = NOW()
WHERE id = $1 AND invitee_user_id = $2
RETURNING *;
