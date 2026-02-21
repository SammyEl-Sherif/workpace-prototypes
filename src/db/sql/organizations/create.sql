INSERT INTO public.organizations (name, domain)
VALUES ($1, $2)
RETURNING *;
