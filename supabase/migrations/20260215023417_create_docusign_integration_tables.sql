create type "public"."contract_signing_method" as enum ('redirect', 'email');

create type "public"."contract_status" as enum ('draft', 'sent', 'signed');


  create table "public"."contracts" (
    "id" uuid not null default gen_random_uuid(),
    "org_id" uuid not null,
    "title" text not null,
    "version" integer not null default 1,
    "status" public.contract_status not null default 'draft'::public.contract_status,
    "signing_method" public.contract_signing_method not null default 'redirect'::public.contract_signing_method,
    "envelope_id" text,
    "template_id" text,
    "document_url" text,
    "signer_email" text not null,
    "signer_name" text not null,
    "sent_at" timestamp with time zone,
    "signed_at" timestamp with time zone,
    "voided_at" timestamp with time zone,
    "created_by" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."contracts" enable row level security;


  create table "public"."docusign_connections" (
    "id" uuid not null default gen_random_uuid(),
    "org_id" uuid not null,
    "access_token" text not null,
    "refresh_token" text not null,
    "token_expires_at" timestamp with time zone not null,
    "account_id" text not null,
    "base_uri" text not null,
    "connected_by" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."docusign_connections" enable row level security;

CREATE UNIQUE INDEX contracts_pkey ON public.contracts USING btree (id);

CREATE UNIQUE INDEX docusign_connections_org_id_key ON public.docusign_connections USING btree (org_id);

CREATE UNIQUE INDEX docusign_connections_pkey ON public.docusign_connections USING btree (id);

CREATE INDEX idx_contracts_envelope_id ON public.contracts USING btree (envelope_id);

CREATE INDEX idx_contracts_org_id ON public.contracts USING btree (org_id);

CREATE INDEX idx_contracts_status ON public.contracts USING btree (status);

CREATE INDEX idx_docusign_connections_org_id ON public.docusign_connections USING btree (org_id);

alter table "public"."contracts" add constraint "contracts_pkey" PRIMARY KEY using index "contracts_pkey";

alter table "public"."docusign_connections" add constraint "docusign_connections_pkey" PRIMARY KEY using index "docusign_connections_pkey";

alter table "public"."contracts" add constraint "contracts_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."contracts" validate constraint "contracts_created_by_fkey";

alter table "public"."contracts" add constraint "contracts_org_id_fkey" FOREIGN KEY (org_id) REFERENCES public.organizations(id) ON DELETE CASCADE not valid;

alter table "public"."contracts" validate constraint "contracts_org_id_fkey";

alter table "public"."docusign_connections" add constraint "docusign_connections_connected_by_fkey" FOREIGN KEY (connected_by) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."docusign_connections" validate constraint "docusign_connections_connected_by_fkey";

alter table "public"."docusign_connections" add constraint "docusign_connections_org_id_fkey" FOREIGN KEY (org_id) REFERENCES public.organizations(id) ON DELETE CASCADE not valid;

alter table "public"."docusign_connections" validate constraint "docusign_connections_org_id_fkey";

alter table "public"."docusign_connections" add constraint "docusign_connections_org_id_key" UNIQUE using index "docusign_connections_org_id_key";

grant delete on table "public"."contracts" to "anon";

grant insert on table "public"."contracts" to "anon";

grant references on table "public"."contracts" to "anon";

grant select on table "public"."contracts" to "anon";

grant trigger on table "public"."contracts" to "anon";

grant truncate on table "public"."contracts" to "anon";

grant update on table "public"."contracts" to "anon";

grant delete on table "public"."contracts" to "authenticated";

grant insert on table "public"."contracts" to "authenticated";

grant references on table "public"."contracts" to "authenticated";

grant select on table "public"."contracts" to "authenticated";

grant trigger on table "public"."contracts" to "authenticated";

grant truncate on table "public"."contracts" to "authenticated";

grant update on table "public"."contracts" to "authenticated";

grant delete on table "public"."contracts" to "service_role";

grant insert on table "public"."contracts" to "service_role";

grant references on table "public"."contracts" to "service_role";

grant select on table "public"."contracts" to "service_role";

grant trigger on table "public"."contracts" to "service_role";

grant truncate on table "public"."contracts" to "service_role";

grant update on table "public"."contracts" to "service_role";

grant delete on table "public"."docusign_connections" to "anon";

grant insert on table "public"."docusign_connections" to "anon";

grant references on table "public"."docusign_connections" to "anon";

grant select on table "public"."docusign_connections" to "anon";

grant trigger on table "public"."docusign_connections" to "anon";

grant truncate on table "public"."docusign_connections" to "anon";

grant update on table "public"."docusign_connections" to "anon";

grant delete on table "public"."docusign_connections" to "authenticated";

grant insert on table "public"."docusign_connections" to "authenticated";

grant references on table "public"."docusign_connections" to "authenticated";

grant select on table "public"."docusign_connections" to "authenticated";

grant trigger on table "public"."docusign_connections" to "authenticated";

grant truncate on table "public"."docusign_connections" to "authenticated";

grant update on table "public"."docusign_connections" to "authenticated";

grant delete on table "public"."docusign_connections" to "service_role";

grant insert on table "public"."docusign_connections" to "service_role";

grant references on table "public"."docusign_connections" to "service_role";

grant select on table "public"."docusign_connections" to "service_role";

grant trigger on table "public"."docusign_connections" to "service_role";

grant truncate on table "public"."docusign_connections" to "service_role";

grant update on table "public"."docusign_connections" to "service_role";


  create policy "Admins can manage contracts"
  on "public"."contracts"
  as permissive
  for all
  to public
using ((EXISTS ( SELECT 1
   FROM public.user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'admin'::public.user_role)))))
with check ((EXISTS ( SELECT 1
   FROM public.user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'admin'::public.user_role)))));



  create policy "Portal users can view their org contracts"
  on "public"."contracts"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.portal_users
  WHERE ((portal_users.org_id = contracts.org_id) AND (portal_users.user_id = auth.uid()) AND (portal_users.status = 'active'::public.portal_user_status)))));



  create policy "Admins can manage docusign connections"
  on "public"."docusign_connections"
  as permissive
  for all
  to public
using ((EXISTS ( SELECT 1
   FROM public.user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'admin'::public.user_role)))))
with check ((EXISTS ( SELECT 1
   FROM public.user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'admin'::public.user_role)))));



  create policy "Portal admins can create org connection"
  on "public"."docusign_connections"
  as permissive
  for insert
  to public
with check ((EXISTS ( SELECT 1
   FROM public.portal_users
  WHERE ((portal_users.org_id = docusign_connections.org_id) AND (portal_users.user_id = auth.uid()) AND (portal_users.status = 'active'::public.portal_user_status) AND (portal_users.role = 'admin'::public.portal_user_role)))));



  create policy "Portal admins can delete org connection"
  on "public"."docusign_connections"
  as permissive
  for delete
  to public
using ((EXISTS ( SELECT 1
   FROM public.portal_users
  WHERE ((portal_users.org_id = docusign_connections.org_id) AND (portal_users.user_id = auth.uid()) AND (portal_users.status = 'active'::public.portal_user_status) AND (portal_users.role = 'admin'::public.portal_user_role)))));



  create policy "Portal admins can update org connection"
  on "public"."docusign_connections"
  as permissive
  for update
  to public
using ((EXISTS ( SELECT 1
   FROM public.portal_users
  WHERE ((portal_users.org_id = docusign_connections.org_id) AND (portal_users.user_id = auth.uid()) AND (portal_users.status = 'active'::public.portal_user_status) AND (portal_users.role = 'admin'::public.portal_user_role)))))
with check ((EXISTS ( SELECT 1
   FROM public.portal_users
  WHERE ((portal_users.org_id = docusign_connections.org_id) AND (portal_users.user_id = auth.uid()) AND (portal_users.status = 'active'::public.portal_user_status) AND (portal_users.role = 'admin'::public.portal_user_role)))));



  create policy "Portal admins can view their org connection"
  on "public"."docusign_connections"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.portal_users
  WHERE ((portal_users.org_id = docusign_connections.org_id) AND (portal_users.user_id = auth.uid()) AND (portal_users.status = 'active'::public.portal_user_status) AND (portal_users.role = 'admin'::public.portal_user_role)))));


CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON public.contracts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_docusign_connections_updated_at BEFORE UPDATE ON public.docusign_connections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


