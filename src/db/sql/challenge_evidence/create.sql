-- Create challenge evidence
INSERT INTO public.challenge_evidence (
  challenge_id,
  participant_user_id,
  evidence_date,
  file_name,
  storage_path,
  media_type,
  media_url,
  thumbnail_url,
  file_size_bytes,
  mime_type,
  notes
)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
ON CONFLICT (challenge_id, participant_user_id, evidence_date) 
DO UPDATE SET
  file_name = EXCLUDED.file_name,
  storage_path = EXCLUDED.storage_path,
  media_type = EXCLUDED.media_type,
  media_url = EXCLUDED.media_url,
  thumbnail_url = EXCLUDED.thumbnail_url,
  file_size_bytes = EXCLUDED.file_size_bytes,
  mime_type = EXCLUDED.mime_type,
  notes = EXCLUDED.notes
RETURNING *;
