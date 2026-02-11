-- Get evidence for a specific user in a challenge
SELECT *
FROM public.challenge_evidence
WHERE challenge_id = $1 AND participant_user_id = $2
ORDER BY evidence_date DESC;
