DELETE FROM public.event_guests
WHERE id = $1
  AND event_id = $2
RETURNING *;
