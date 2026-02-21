drop policy "Portal users can create their org intake" on "public"."intake_submissions";

drop policy "Portal users can update their org intake" on "public"."intake_submissions";

drop policy "Portal users can view their org intake" on "public"."intake_submissions";


  create policy "Portal users can create their org intake"
  on "public"."intake_submissions"
  as permissive
  for insert
  to public
with check ((EXISTS ( SELECT 1
   FROM public.portal_users
  WHERE ((portal_users.org_id = intake_submissions.org_id) AND (portal_users.user_id = auth.uid()) AND (portal_users.status = ANY (ARRAY['pending_approval'::public.portal_user_status, 'active'::public.portal_user_status]))))));



  create policy "Portal users can update their org intake"
  on "public"."intake_submissions"
  as permissive
  for update
  to public
using ((EXISTS ( SELECT 1
   FROM public.portal_users
  WHERE ((portal_users.org_id = intake_submissions.org_id) AND (portal_users.user_id = auth.uid()) AND (portal_users.status = ANY (ARRAY['pending_approval'::public.portal_user_status, 'active'::public.portal_user_status]))))))
with check ((EXISTS ( SELECT 1
   FROM public.portal_users
  WHERE ((portal_users.org_id = intake_submissions.org_id) AND (portal_users.user_id = auth.uid()) AND (portal_users.status = ANY (ARRAY['pending_approval'::public.portal_user_status, 'active'::public.portal_user_status]))))));



  create policy "Portal users can view their org intake"
  on "public"."intake_submissions"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.portal_users
  WHERE ((portal_users.org_id = intake_submissions.org_id) AND (portal_users.user_id = auth.uid()) AND (portal_users.status = ANY (ARRAY['pending_approval'::public.portal_user_status, 'active'::public.portal_user_status]))))));



