SELECT * FROM public.hh_day
WHERE restaurant_id = $1
ORDER BY day_of_week;

