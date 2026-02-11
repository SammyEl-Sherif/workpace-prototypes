-- Create a challenge invitation
INSERT INTO public.challenge_invitations (challenge_id, inviter_user_id, invitee_user_id)
VALUES ($1, $2, $3)
ON CONFLICT (challenge_id, invitee_user_id) DO NOTHING
RETURNING *;
