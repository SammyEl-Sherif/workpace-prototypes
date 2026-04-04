
  create table "public"."pipeline_audit_log" (
    "id" uuid not null default gen_random_uuid(),
    "thread_id" text not null,
    "node_name" text not null,
    "event_type" text not null,
    "actor" text not null default 'system'::text,
    "payload" jsonb default '{}'::jsonb,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."pipeline_audit_log" enable row level security;


  create table "public"."pipeline_threads" (
    "id" uuid not null default gen_random_uuid(),
    "thread_id" text not null,
    "client_email" text,
    "client_phone" text,
    "org_id" uuid,
    "envelope_id" text,
    "notion_page_id" text,
    "status" text not null default 'active'::text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."pipeline_threads" enable row level security;

CREATE INDEX idx_pipeline_audit_log_created ON public.pipeline_audit_log USING btree (created_at);

CREATE INDEX idx_pipeline_audit_log_thread ON public.pipeline_audit_log USING btree (thread_id);

CREATE INDEX idx_pipeline_threads_email ON public.pipeline_threads USING btree (client_email);

CREATE INDEX idx_pipeline_threads_envelope ON public.pipeline_threads USING btree (envelope_id);

CREATE INDEX idx_pipeline_threads_org ON public.pipeline_threads USING btree (org_id);

CREATE UNIQUE INDEX pipeline_audit_log_pkey ON public.pipeline_audit_log USING btree (id);

CREATE UNIQUE INDEX pipeline_threads_pkey ON public.pipeline_threads USING btree (id);

CREATE UNIQUE INDEX pipeline_threads_thread_id_key ON public.pipeline_threads USING btree (thread_id);

alter table "public"."pipeline_audit_log" add constraint "pipeline_audit_log_pkey" PRIMARY KEY using index "pipeline_audit_log_pkey";

alter table "public"."pipeline_threads" add constraint "pipeline_threads_pkey" PRIMARY KEY using index "pipeline_threads_pkey";

alter table "public"."pipeline_threads" add constraint "pipeline_threads_org_id_fkey" FOREIGN KEY (org_id) REFERENCES public.organizations(id) not valid;

alter table "public"."pipeline_threads" validate constraint "pipeline_threads_org_id_fkey";

alter table "public"."pipeline_threads" add constraint "pipeline_threads_thread_id_key" UNIQUE using index "pipeline_threads_thread_id_key";

grant delete on table "public"."pipeline_audit_log" to "anon";

grant insert on table "public"."pipeline_audit_log" to "anon";

grant references on table "public"."pipeline_audit_log" to "anon";

grant select on table "public"."pipeline_audit_log" to "anon";

grant trigger on table "public"."pipeline_audit_log" to "anon";

grant truncate on table "public"."pipeline_audit_log" to "anon";

grant update on table "public"."pipeline_audit_log" to "anon";

grant delete on table "public"."pipeline_audit_log" to "authenticated";

grant insert on table "public"."pipeline_audit_log" to "authenticated";

grant references on table "public"."pipeline_audit_log" to "authenticated";

grant select on table "public"."pipeline_audit_log" to "authenticated";

grant trigger on table "public"."pipeline_audit_log" to "authenticated";

grant truncate on table "public"."pipeline_audit_log" to "authenticated";

grant update on table "public"."pipeline_audit_log" to "authenticated";

grant delete on table "public"."pipeline_audit_log" to "service_role";

grant insert on table "public"."pipeline_audit_log" to "service_role";

grant references on table "public"."pipeline_audit_log" to "service_role";

grant select on table "public"."pipeline_audit_log" to "service_role";

grant trigger on table "public"."pipeline_audit_log" to "service_role";

grant truncate on table "public"."pipeline_audit_log" to "service_role";

grant update on table "public"."pipeline_audit_log" to "service_role";

grant delete on table "public"."pipeline_threads" to "anon";

grant insert on table "public"."pipeline_threads" to "anon";

grant references on table "public"."pipeline_threads" to "anon";

grant select on table "public"."pipeline_threads" to "anon";

grant trigger on table "public"."pipeline_threads" to "anon";

grant truncate on table "public"."pipeline_threads" to "anon";

grant update on table "public"."pipeline_threads" to "anon";

grant delete on table "public"."pipeline_threads" to "authenticated";

grant insert on table "public"."pipeline_threads" to "authenticated";

grant references on table "public"."pipeline_threads" to "authenticated";

grant select on table "public"."pipeline_threads" to "authenticated";

grant trigger on table "public"."pipeline_threads" to "authenticated";

grant truncate on table "public"."pipeline_threads" to "authenticated";

grant update on table "public"."pipeline_threads" to "authenticated";

grant delete on table "public"."pipeline_threads" to "service_role";

grant insert on table "public"."pipeline_threads" to "service_role";

grant references on table "public"."pipeline_threads" to "service_role";

grant select on table "public"."pipeline_threads" to "service_role";

grant trigger on table "public"."pipeline_threads" to "service_role";

grant truncate on table "public"."pipeline_threads" to "service_role";

grant update on table "public"."pipeline_threads" to "service_role";


  create policy "Service role can manage pipeline audit log"
  on "public"."pipeline_audit_log"
  as permissive
  for all
  to public
using (true)
with check (true);



  create policy "Service role can manage pipeline threads"
  on "public"."pipeline_threads"
  as permissive
  for all
  to public
using (true)
with check (true);


CREATE TRIGGER update_pipeline_threads_updated_at BEFORE UPDATE ON public.pipeline_threads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


