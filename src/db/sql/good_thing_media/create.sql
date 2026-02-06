INSERT INTO public.good_thing_media (
  good_thing_id,
  user_id,
  file_name,
  storage_path,
  media_type,
  media_url,
  thumbnail_url,
  file_size_bytes,
  mime_type
)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
RETURNING *;
