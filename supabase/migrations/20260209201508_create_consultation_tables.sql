create type "public"."consultation_budget_range" as enum ('under-1k', '1k-5k', '5k-15k', '15k-50k', '50k+', 'unsure');

create type "public"."consultation_request_status" as enum ('requested', 'in_review', 'accepted', 'declined');

create type "public"."consultation_service_type" as enum ('notion-templates', 'notion-consulting', 'software-products', 'software-consulting', 'other');

create type "public"."consultation_timeline" as enum ('asap', '1-2-weeks', '1-month', '1-3-months', 'flexible');


  create table "public"."consultation_requests" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "email" text not null,
    "company" text,
    "service" public.consultation_service_type not null,
    "budget" public.consultation_budget_range,
    "timeline" public.consultation_timeline,
    "message" text,
    "status" public.consultation_request_status not null default 'requested'::public.consultation_request_status,
    "admin_notes" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."consultation_requests" enable row level security;

CREATE UNIQUE INDEX consultation_requests_pkey ON public.consultation_requests USING btree (id);

CREATE INDEX idx_consultation_requests_created_at ON public.consultation_requests USING btree (created_at DESC);

CREATE INDEX idx_consultation_requests_email ON public.consultation_requests USING btree (email);

CREATE INDEX idx_consultation_requests_service ON public.consultation_requests USING btree (service);

CREATE INDEX idx_consultation_requests_status ON public.consultation_requests USING btree (status);

alter table "public"."consultation_requests" add constraint "consultation_requests_pkey" PRIMARY KEY using index "consultation_requests_pkey";

alter table "public"."consultation_requests" add constraint "consultation_requests_email_not_empty" CHECK ((char_length(TRIM(BOTH FROM email)) > 0)) not valid;

alter table "public"."consultation_requests" validate constraint "consultation_requests_email_not_empty";

alter table "public"."consultation_requests" add constraint "consultation_requests_name_not_empty" CHECK ((char_length(TRIM(BOTH FROM name)) > 0)) not valid;

alter table "public"."consultation_requests" validate constraint "consultation_requests_name_not_empty";

grant delete on table "public"."consultation_requests" to "anon";

grant insert on table "public"."consultation_requests" to "anon";

grant references on table "public"."consultation_requests" to "anon";

grant select on table "public"."consultation_requests" to "anon";

grant trigger on table "public"."consultation_requests" to "anon";

grant truncate on table "public"."consultation_requests" to "anon";

grant update on table "public"."consultation_requests" to "anon";

grant delete on table "public"."consultation_requests" to "authenticated";

grant insert on table "public"."consultation_requests" to "authenticated";

grant references on table "public"."consultation_requests" to "authenticated";

grant select on table "public"."consultation_requests" to "authenticated";

grant trigger on table "public"."consultation_requests" to "authenticated";

grant truncate on table "public"."consultation_requests" to "authenticated";

grant update on table "public"."consultation_requests" to "authenticated";

grant delete on table "public"."consultation_requests" to "service_role";

grant insert on table "public"."consultation_requests" to "service_role";

grant references on table "public"."consultation_requests" to "service_role";

grant select on table "public"."consultation_requests" to "service_role";

grant trigger on table "public"."consultation_requests" to "service_role";

grant truncate on table "public"."consultation_requests" to "service_role";

grant update on table "public"."consultation_requests" to "service_role";


  create policy "Anyone can submit a consultation request"
  on "public"."consultation_requests"
  as permissive
  for insert
  to public
with check (true);



  create policy "Service role can manage consultation requests"
  on "public"."consultation_requests"
  as permissive
  for all
  to public
using ((auth.role() = 'service_role'::text));


CREATE TRIGGER update_consultation_requests_updated_at BEFORE UPDATE ON public.consultation_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


