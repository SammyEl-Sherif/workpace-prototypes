SELECT role::text as role
FROM public.user_roles
WHERE user_id = $1
ORDER BY role;
