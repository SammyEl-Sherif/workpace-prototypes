-- Update friend invitation status
UPDATE public.friend_invitations
SET status = $2, updated_at = NOW()
WHERE id = $1 AND invitee_user_id = $3
RETURNING *;
