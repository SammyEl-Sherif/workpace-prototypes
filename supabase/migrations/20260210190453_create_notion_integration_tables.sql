
  create table "public"."notion_connections" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "access_token" text not null,
    "workspace_id" text,
    "workspace_name" text,
    "bot_id" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."notion_connections" enable row level security;

CREATE INDEX idx_notion_connections_user_id ON public.notion_connections USING btree (user_id);

CREATE UNIQUE INDEX notion_connections_pkey ON public.notion_connections USING btree (id);

CREATE UNIQUE INDEX notion_connections_user_id_unique ON public.notion_connections USING btree (user_id);

alter table "public"."notion_connections" add constraint "notion_connections_pkey" PRIMARY KEY using index "notion_connections_pkey";

alter table "public"."notion_connections" add constraint "notion_connections_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."notion_connections" validate constraint "notion_connections_user_id_fkey";

alter table "public"."notion_connections" add constraint "notion_connections_user_id_unique" UNIQUE using index "notion_connections_user_id_unique";

grant delete on table "public"."notion_connections" to "anon";

grant insert on table "public"."notion_connections" to "anon";

grant references on table "public"."notion_connections" to "anon";

grant select on table "public"."notion_connections" to "anon";

grant trigger on table "public"."notion_connections" to "anon";

grant truncate on table "public"."notion_connections" to "anon";

grant update on table "public"."notion_connections" to "anon";

grant delete on table "public"."notion_connections" to "authenticated";

grant insert on table "public"."notion_connections" to "authenticated";

grant references on table "public"."notion_connections" to "authenticated";

grant select on table "public"."notion_connections" to "authenticated";

grant trigger on table "public"."notion_connections" to "authenticated";

grant truncate on table "public"."notion_connections" to "authenticated";

grant update on table "public"."notion_connections" to "authenticated";

grant delete on table "public"."notion_connections" to "service_role";

grant insert on table "public"."notion_connections" to "service_role";

grant references on table "public"."notion_connections" to "service_role";

grant select on table "public"."notion_connections" to "service_role";

grant trigger on table "public"."notion_connections" to "service_role";

grant truncate on table "public"."notion_connections" to "service_role";

grant update on table "public"."notion_connections" to "service_role";


  create policy "Users can delete their own connections"
  on "public"."notion_connections"
  as permissive
  for delete
  to public
using ((auth.uid() = user_id));



  create policy "Users can insert their own connections"
  on "public"."notion_connections"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can update their own connections"
  on "public"."notion_connections"
  as permissive
  for update
  to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));



  create policy "Users can view their own connections"
  on "public"."notion_connections"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));


CREATE TRIGGER update_notion_connections_updated_at BEFORE UPDATE ON public.notion_connections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


