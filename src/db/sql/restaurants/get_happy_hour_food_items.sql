SELECT * FROM public.hh_food_item
WHERE hh_day_id = ANY($1::integer[]);

