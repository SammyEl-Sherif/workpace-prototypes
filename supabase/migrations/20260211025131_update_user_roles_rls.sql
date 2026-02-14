
  create policy "System can assign default roles"
  on "public"."user_roles"
  as permissive
  for insert
  to public
with check ((role = 'default'::public.user_role));



