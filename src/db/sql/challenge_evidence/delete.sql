-- Delete challenge evidence (only if user is the participant)
DELETE FROM public.challenge_evidence
WHERE id = $1 AND participant_user_id = $2
RETURNING *;
