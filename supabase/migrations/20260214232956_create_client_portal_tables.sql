create type "public"."portal_user_role" as enum ('admin', 'member');

create type "public"."portal_user_status" as enum ('pending_approval', 'active', 'deactivated');


  create table "public"."organizations" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "domain" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."organizations" enable row level security;


  create table "public"."portal_users" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "org_id" uuid not null,
    "role" public.portal_user_role not null default 'admin'::public.portal_user_role,
    "status" public.portal_user_status not null default 'pending_approval'::public.portal_user_status,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."portal_users" enable row level security;

CREATE INDEX idx_organizations_domain ON public.organizations USING btree (domain);

CREATE INDEX idx_portal_users_org_id ON public.portal_users USING btree (org_id);

CREATE INDEX idx_portal_users_status ON public.portal_users USING btree (status);

CREATE INDEX idx_portal_users_user_id ON public.portal_users USING btree (user_id);

CREATE UNIQUE INDEX organizations_pkey ON public.organizations USING btree (id);

CREATE UNIQUE INDEX portal_users_pkey ON public.portal_users USING btree (id);

CREATE UNIQUE INDEX portal_users_user_org_unique ON public.portal_users USING btree (user_id, org_id);

alter table "public"."organizations" add constraint "organizations_pkey" PRIMARY KEY using index "organizations_pkey";

alter table "public"."portal_users" add constraint "portal_users_pkey" PRIMARY KEY using index "portal_users_pkey";

alter table "public"."portal_users" add constraint "portal_users_org_id_fkey" FOREIGN KEY (org_id) REFERENCES public.organizations(id) ON DELETE CASCADE not valid;

alter table "public"."portal_users" validate constraint "portal_users_org_id_fkey";

alter table "public"."portal_users" add constraint "portal_users_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."portal_users" validate constraint "portal_users_user_id_fkey";

alter table "public"."portal_users" add constraint "portal_users_user_org_unique" UNIQUE using index "portal_users_user_org_unique";

grant delete on table "public"."organizations" to "anon";

grant insert on table "public"."organizations" to "anon";

grant references on table "public"."organizations" to "anon";

grant select on table "public"."organizations" to "anon";

grant trigger on table "public"."organizations" to "anon";

grant truncate on table "public"."organizations" to "anon";

grant update on table "public"."organizations" to "anon";

grant delete on table "public"."organizations" to "authenticated";

grant insert on table "public"."organizations" to "authenticated";

grant references on table "public"."organizations" to "authenticated";

grant select on table "public"."organizations" to "authenticated";

grant trigger on table "public"."organizations" to "authenticated";

grant truncate on table "public"."organizations" to "authenticated";

grant update on table "public"."organizations" to "authenticated";

grant delete on table "public"."organizations" to "service_role";

grant insert on table "public"."organizations" to "service_role";

grant references on table "public"."organizations" to "service_role";

grant select on table "public"."organizations" to "service_role";

grant trigger on table "public"."organizations" to "service_role";

grant truncate on table "public"."organizations" to "service_role";

grant update on table "public"."organizations" to "service_role";

grant delete on table "public"."portal_users" to "anon";

grant insert on table "public"."portal_users" to "anon";

grant references on table "public"."portal_users" to "anon";

grant select on table "public"."portal_users" to "anon";

grant trigger on table "public"."portal_users" to "anon";

grant truncate on table "public"."portal_users" to "anon";

grant update on table "public"."portal_users" to "anon";

grant delete on table "public"."portal_users" to "authenticated";

grant insert on table "public"."portal_users" to "authenticated";

grant references on table "public"."portal_users" to "authenticated";

grant select on table "public"."portal_users" to "authenticated";

grant trigger on table "public"."portal_users" to "authenticated";

grant truncate on table "public"."portal_users" to "authenticated";

grant update on table "public"."portal_users" to "authenticated";

grant delete on table "public"."portal_users" to "service_role";

grant insert on table "public"."portal_users" to "service_role";

grant references on table "public"."portal_users" to "service_role";

grant select on table "public"."portal_users" to "service_role";

grant trigger on table "public"."portal_users" to "service_role";

grant truncate on table "public"."portal_users" to "service_role";

grant update on table "public"."portal_users" to "service_role";


  create policy "Admins can manage organizations"
  on "public"."organizations"
  as permissive
  for all
  to public
using ((EXISTS ( SELECT 1
   FROM public.user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'admin'::public.user_role)))))
with check ((EXISTS ( SELECT 1
   FROM public.user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'admin'::public.user_role)))));



  create policy "Portal users can view their organization"
  on "public"."organizations"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.portal_users
  WHERE ((portal_users.org_id = organizations.id) AND (portal_users.user_id = auth.uid())))));



  create policy "Service role can insert organizations"
  on "public"."organizations"
  as permissive
  for insert
  to public
with check (true);



  create policy "Admins can manage portal users"
  on "public"."portal_users"
  as permissive
  for all
  to public
using ((EXISTS ( SELECT 1
   FROM public.user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'admin'::public.user_role)))))
with check ((EXISTS ( SELECT 1
   FROM public.user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'admin'::public.user_role)))));



  create policy "Users can sign up for portal"
  on "public"."portal_users"
  as permissive
  for insert
  to public
with check (((auth.uid() = user_id) AND (status = 'pending_approval'::public.portal_user_status)));



  create policy "Users can view their own portal records"
  on "public"."portal_users"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));


CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portal_users_updated_at BEFORE UPDATE ON public.portal_users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


