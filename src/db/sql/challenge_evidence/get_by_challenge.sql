-- Get all evidence for a challenge
SELECT 
  ce.*,
  u.email as participant_email
FROM public.challenge_evidence ce
LEFT JOIN auth.users u ON ce.participant_user_id = u.id
WHERE ce.challenge_id = $1
ORDER BY ce.evidence_date DESC, ce.created_at DESC;
