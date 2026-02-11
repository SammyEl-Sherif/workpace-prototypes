-- Create a friend invitation
INSERT INTO public.friend_invitations (inviter_user_id, invitee_user_id, status)
VALUES ($1, $2, 'pending')
RETURNING *;
