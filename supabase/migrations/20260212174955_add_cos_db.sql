
  create table "public"."chief_of_staff_databases" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "database_id" text not null,
    "database_title" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."chief_of_staff_databases" enable row level security;

CREATE UNIQUE INDEX chief_of_staff_databases_pkey ON public.chief_of_staff_databases USING btree (id);

CREATE UNIQUE INDEX chief_of_staff_databases_unique ON public.chief_of_staff_databases USING btree (user_id, database_id);

CREATE INDEX idx_chief_of_staff_databases_database_id ON public.chief_of_staff_databases USING btree (database_id);

CREATE INDEX idx_chief_of_staff_databases_user_id ON public.chief_of_staff_databases USING btree (user_id);

alter table "public"."chief_of_staff_databases" add constraint "chief_of_staff_databases_pkey" PRIMARY KEY using index "chief_of_staff_databases_pkey";

alter table "public"."chief_of_staff_databases" add constraint "chief_of_staff_databases_unique" UNIQUE using index "chief_of_staff_databases_unique";

alter table "public"."chief_of_staff_databases" add constraint "chief_of_staff_databases_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."chief_of_staff_databases" validate constraint "chief_of_staff_databases_user_id_fkey";

grant delete on table "public"."chief_of_staff_databases" to "anon";

grant insert on table "public"."chief_of_staff_databases" to "anon";

grant references on table "public"."chief_of_staff_databases" to "anon";

grant select on table "public"."chief_of_staff_databases" to "anon";

grant trigger on table "public"."chief_of_staff_databases" to "anon";

grant truncate on table "public"."chief_of_staff_databases" to "anon";

grant update on table "public"."chief_of_staff_databases" to "anon";

grant delete on table "public"."chief_of_staff_databases" to "authenticated";

grant insert on table "public"."chief_of_staff_databases" to "authenticated";

grant references on table "public"."chief_of_staff_databases" to "authenticated";

grant select on table "public"."chief_of_staff_databases" to "authenticated";

grant trigger on table "public"."chief_of_staff_databases" to "authenticated";

grant truncate on table "public"."chief_of_staff_databases" to "authenticated";

grant update on table "public"."chief_of_staff_databases" to "authenticated";

grant delete on table "public"."chief_of_staff_databases" to "service_role";

grant insert on table "public"."chief_of_staff_databases" to "service_role";

grant references on table "public"."chief_of_staff_databases" to "service_role";

grant select on table "public"."chief_of_staff_databases" to "service_role";

grant trigger on table "public"."chief_of_staff_databases" to "service_role";

grant truncate on table "public"."chief_of_staff_databases" to "service_role";

grant update on table "public"."chief_of_staff_databases" to "service_role";


  create policy "Users can delete their own databases"
  on "public"."chief_of_staff_databases"
  as permissive
  for delete
  to public
using ((auth.uid() = user_id));



  create policy "Users can insert their own databases"
  on "public"."chief_of_staff_databases"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can update their own databases"
  on "public"."chief_of_staff_databases"
  as permissive
  for update
  to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));



  create policy "Users can view their own databases"
  on "public"."chief_of_staff_databases"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));


CREATE TRIGGER update_chief_of_staff_databases_updated_at BEFORE UPDATE ON public.chief_of_staff_databases FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


