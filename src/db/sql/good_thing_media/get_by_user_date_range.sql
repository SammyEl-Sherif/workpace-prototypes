SELECT
  gtm.id AS media_id,
  gtm.good_thing_id,
  gtm.file_name,
  gtm.storage_path,
  gtm.media_type,
  gtm.media_url,
  gtm.thumbnail_url,
  gtm.mime_type,
  gt.id AS good_thing_id,
  gt.title,
  gt.description,
  gt.completion_date,
  gt.created_at AS good_thing_created_at,
  g.name AS goal_name
FROM public.good_thing_media gtm
INNER JOIN public.good_things gt ON gtm.good_thing_id = gt.id
LEFT JOIN public.goals g ON gt.goal_id = g.id
WHERE gtm.user_id = $1
  AND gt.created_at >= $2::timestamptz
  AND gt.created_at < $3::timestamptz
ORDER BY gt.created_at DESC;
