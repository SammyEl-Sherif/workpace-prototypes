SELECT * FROM public.restaurant_hours
WHERE restaurant_id = $1
ORDER BY day_of_week;

