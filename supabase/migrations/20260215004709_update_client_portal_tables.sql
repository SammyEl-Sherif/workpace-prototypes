create type "public"."change_request_category" as enum ('bug_fix', 'feature_request', 'improvement', 'documentation', 'other');

create type "public"."change_request_priority" as enum ('low', 'medium', 'high', 'urgent');

create type "public"."change_request_status" as enum ('submitted', 'under_review', 'approved', 'in_progress', 'completed', 'rejected');

create type "public"."intake_submission_status" as enum ('draft', 'submitted', 'reviewed');


  create table "public"."change_requests" (
    "id" uuid not null default gen_random_uuid(),
    "org_id" uuid not null,
    "submitted_by" uuid not null,
    "title" text not null,
    "description" text not null,
    "category" public.change_request_category not null default 'other'::public.change_request_category,
    "priority" public.change_request_priority not null default 'medium'::public.change_request_priority,
    "status" public.change_request_status not null default 'submitted'::public.change_request_status,
    "admin_notes" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."change_requests" enable row level security;


  create table "public"."intake_submissions" (
    "id" uuid not null default gen_random_uuid(),
    "org_id" uuid not null,
    "submitted_by" uuid not null,
    "status" public.intake_submission_status not null default 'draft'::public.intake_submission_status,
    "company_info" jsonb default '{}'::jsonb,
    "tools_tech" jsonb default '{}'::jsonb,
    "goals_needs" jsonb default '{}'::jsonb,
    "submitted_at" timestamp with time zone,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."intake_submissions" enable row level security;

CREATE UNIQUE INDEX change_requests_pkey ON public.change_requests USING btree (id);

CREATE INDEX idx_change_requests_org_id ON public.change_requests USING btree (org_id);

CREATE INDEX idx_change_requests_status ON public.change_requests USING btree (status);

CREATE INDEX idx_change_requests_submitted_by ON public.change_requests USING btree (submitted_by);

CREATE INDEX idx_intake_submissions_org_id ON public.intake_submissions USING btree (org_id);

CREATE INDEX idx_intake_submissions_status ON public.intake_submissions USING btree (status);

CREATE UNIQUE INDEX intake_submissions_org_unique ON public.intake_submissions USING btree (org_id);

CREATE UNIQUE INDEX intake_submissions_pkey ON public.intake_submissions USING btree (id);

alter table "public"."change_requests" add constraint "change_requests_pkey" PRIMARY KEY using index "change_requests_pkey";

alter table "public"."intake_submissions" add constraint "intake_submissions_pkey" PRIMARY KEY using index "intake_submissions_pkey";

alter table "public"."change_requests" add constraint "change_requests_org_id_fkey" FOREIGN KEY (org_id) REFERENCES public.organizations(id) ON DELETE CASCADE not valid;

alter table "public"."change_requests" validate constraint "change_requests_org_id_fkey";

alter table "public"."change_requests" add constraint "change_requests_submitted_by_fkey" FOREIGN KEY (submitted_by) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."change_requests" validate constraint "change_requests_submitted_by_fkey";

alter table "public"."intake_submissions" add constraint "intake_submissions_org_id_fkey" FOREIGN KEY (org_id) REFERENCES public.organizations(id) ON DELETE CASCADE not valid;

alter table "public"."intake_submissions" validate constraint "intake_submissions_org_id_fkey";

alter table "public"."intake_submissions" add constraint "intake_submissions_org_unique" UNIQUE using index "intake_submissions_org_unique";

alter table "public"."intake_submissions" add constraint "intake_submissions_submitted_by_fkey" FOREIGN KEY (submitted_by) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."intake_submissions" validate constraint "intake_submissions_submitted_by_fkey";

grant delete on table "public"."change_requests" to "anon";

grant insert on table "public"."change_requests" to "anon";

grant references on table "public"."change_requests" to "anon";

grant select on table "public"."change_requests" to "anon";

grant trigger on table "public"."change_requests" to "anon";

grant truncate on table "public"."change_requests" to "anon";

grant update on table "public"."change_requests" to "anon";

grant delete on table "public"."change_requests" to "authenticated";

grant insert on table "public"."change_requests" to "authenticated";

grant references on table "public"."change_requests" to "authenticated";

grant select on table "public"."change_requests" to "authenticated";

grant trigger on table "public"."change_requests" to "authenticated";

grant truncate on table "public"."change_requests" to "authenticated";

grant update on table "public"."change_requests" to "authenticated";

grant delete on table "public"."change_requests" to "service_role";

grant insert on table "public"."change_requests" to "service_role";

grant references on table "public"."change_requests" to "service_role";

grant select on table "public"."change_requests" to "service_role";

grant trigger on table "public"."change_requests" to "service_role";

grant truncate on table "public"."change_requests" to "service_role";

grant update on table "public"."change_requests" to "service_role";

grant delete on table "public"."intake_submissions" to "anon";

grant insert on table "public"."intake_submissions" to "anon";

grant references on table "public"."intake_submissions" to "anon";

grant select on table "public"."intake_submissions" to "anon";

grant trigger on table "public"."intake_submissions" to "anon";

grant truncate on table "public"."intake_submissions" to "anon";

grant update on table "public"."intake_submissions" to "anon";

grant delete on table "public"."intake_submissions" to "authenticated";

grant insert on table "public"."intake_submissions" to "authenticated";

grant references on table "public"."intake_submissions" to "authenticated";

grant select on table "public"."intake_submissions" to "authenticated";

grant trigger on table "public"."intake_submissions" to "authenticated";

grant truncate on table "public"."intake_submissions" to "authenticated";

grant update on table "public"."intake_submissions" to "authenticated";

grant delete on table "public"."intake_submissions" to "service_role";

grant insert on table "public"."intake_submissions" to "service_role";

grant references on table "public"."intake_submissions" to "service_role";

grant select on table "public"."intake_submissions" to "service_role";

grant trigger on table "public"."intake_submissions" to "service_role";

grant truncate on table "public"."intake_submissions" to "service_role";

grant update on table "public"."intake_submissions" to "service_role";


  create policy "Admins can manage change requests"
  on "public"."change_requests"
  as permissive
  for all
  to public
using ((EXISTS ( SELECT 1
   FROM public.user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'admin'::public.user_role)))))
with check ((EXISTS ( SELECT 1
   FROM public.user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'admin'::public.user_role)))));



  create policy "Portal users can create org requests"
  on "public"."change_requests"
  as permissive
  for insert
  to public
with check ((EXISTS ( SELECT 1
   FROM public.portal_users
  WHERE ((portal_users.org_id = change_requests.org_id) AND (portal_users.user_id = auth.uid()) AND (portal_users.status = 'active'::public.portal_user_status)))));



  create policy "Portal users can update own submitted requests"
  on "public"."change_requests"
  as permissive
  for update
  to public
using (((submitted_by = auth.uid()) AND (status = 'submitted'::public.change_request_status)))
with check (((submitted_by = auth.uid()) AND (status = 'submitted'::public.change_request_status)));



  create policy "Portal users can view their org requests"
  on "public"."change_requests"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.portal_users
  WHERE ((portal_users.org_id = change_requests.org_id) AND (portal_users.user_id = auth.uid()) AND (portal_users.status = 'active'::public.portal_user_status)))));



  create policy "Admins can manage intake submissions"
  on "public"."intake_submissions"
  as permissive
  for all
  to public
using ((EXISTS ( SELECT 1
   FROM public.user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'admin'::public.user_role)))))
with check ((EXISTS ( SELECT 1
   FROM public.user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'admin'::public.user_role)))));



  create policy "Portal users can create their org intake"
  on "public"."intake_submissions"
  as permissive
  for insert
  to public
with check ((EXISTS ( SELECT 1
   FROM public.portal_users
  WHERE ((portal_users.org_id = intake_submissions.org_id) AND (portal_users.user_id = auth.uid()) AND (portal_users.status = 'active'::public.portal_user_status)))));



  create policy "Portal users can update their org intake"
  on "public"."intake_submissions"
  as permissive
  for update
  to public
using ((EXISTS ( SELECT 1
   FROM public.portal_users
  WHERE ((portal_users.org_id = intake_submissions.org_id) AND (portal_users.user_id = auth.uid()) AND (portal_users.status = 'active'::public.portal_user_status)))))
with check ((EXISTS ( SELECT 1
   FROM public.portal_users
  WHERE ((portal_users.org_id = intake_submissions.org_id) AND (portal_users.user_id = auth.uid()) AND (portal_users.status = 'active'::public.portal_user_status)))));



  create policy "Portal users can view their org intake"
  on "public"."intake_submissions"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.portal_users
  WHERE ((portal_users.org_id = intake_submissions.org_id) AND (portal_users.user_id = auth.uid()) AND (portal_users.status = 'active'::public.portal_user_status)))));


CREATE TRIGGER update_change_requests_updated_at BEFORE UPDATE ON public.change_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_intake_submissions_updated_at BEFORE UPDATE ON public.intake_submissions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


