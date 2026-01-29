SELECT * FROM public.hh_event
WHERE hh_day_id = ANY($1::integer[]);

