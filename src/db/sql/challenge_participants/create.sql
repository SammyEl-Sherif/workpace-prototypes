-- Add a participant to a challenge
INSERT INTO public.challenge_participants (challenge_id, user_id)
VALUES ($1, $2)
ON CONFLICT (challenge_id, user_id) DO NOTHING
RETURNING *;
