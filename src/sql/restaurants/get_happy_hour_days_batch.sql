SELECT * FROM public.hh_day
WHERE restaurant_id = ANY($1::text[])
ORDER BY restaurant_id, day_of_week;

