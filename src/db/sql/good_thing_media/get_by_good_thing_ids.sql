SELECT
  id,
  good_thing_id,
  user_id,
  file_name,
  storage_path,
  media_type,
  media_url,
  thumbnail_url,
  file_size_bytes,
  mime_type,
  created_at
FROM public.good_thing_media
WHERE good_thing_id = ANY($1::uuid[])
  AND user_id = $2
ORDER BY good_thing_id, created_at DESC;
