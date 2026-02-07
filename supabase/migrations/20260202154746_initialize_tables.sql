create extension if not exists "pg_net" with schema "extensions";

alter type "public"."prototype_stage" rename to "prototype_stage__old_version_to_be_dropped";

create type "public"."prototype_stage" as enum ('Concept', 'WIP', 'MVP', 'Standalone');

alter type "public"."user_role" rename to "user_role__old_version_to_be_dropped";

create type "public"."user_role" as enum ('default', 'vip', 'admin');


  create table "public"."goals" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "name" text not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."goals" enable row level security;


  create table "public"."good_things" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "goal_id" uuid,
    "title" text not null,
    "description" text,
    "completion_date" date,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."good_things" enable row level security;


  create table "public"."prototypes" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "description" text,
    "stage" public.prototype_stage not null default 'Concept'::public.prototype_stage,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."prototypes" enable row level security;


  create table "public"."user_roles" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "role" public.user_role not null default 'default'::public.user_role,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."user_roles" enable row level security;

drop type "public"."prototype_stage__old_version_to_be_dropped";

drop type "public"."user_role__old_version_to_be_dropped";

CREATE UNIQUE INDEX goals_pkey ON public.goals USING btree (id);

CREATE UNIQUE INDEX good_things_pkey ON public.good_things USING btree (id);

CREATE INDEX idx_goals_user_id ON public.goals USING btree (user_id);

CREATE INDEX idx_good_things_completion_date ON public.good_things USING btree (completion_date);

CREATE INDEX idx_good_things_goal_id ON public.good_things USING btree (goal_id);

CREATE INDEX idx_good_things_user_id ON public.good_things USING btree (user_id);

CREATE INDEX idx_prototypes_stage ON public.prototypes USING btree (stage);

CREATE INDEX idx_user_roles_role ON public.user_roles USING btree (role);

CREATE INDEX idx_user_roles_user_id ON public.user_roles USING btree (user_id);

CREATE UNIQUE INDEX prototypes_pkey ON public.prototypes USING btree (id);

CREATE UNIQUE INDEX user_roles_pkey ON public.user_roles USING btree (id);

CREATE UNIQUE INDEX user_roles_user_id_role_key ON public.user_roles USING btree (user_id, role);

alter table "public"."goals" add constraint "goals_pkey" PRIMARY KEY using index "goals_pkey";

alter table "public"."good_things" add constraint "good_things_pkey" PRIMARY KEY using index "good_things_pkey";

alter table "public"."prototypes" add constraint "prototypes_pkey" PRIMARY KEY using index "prototypes_pkey";

alter table "public"."user_roles" add constraint "user_roles_pkey" PRIMARY KEY using index "user_roles_pkey";

alter table "public"."goals" add constraint "goals_name_not_empty" CHECK ((char_length(TRIM(BOTH FROM name)) > 0)) not valid;

alter table "public"."goals" validate constraint "goals_name_not_empty";

alter table "public"."goals" add constraint "goals_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."goals" validate constraint "goals_user_id_fkey";

alter table "public"."good_things" add constraint "good_things_goal_id_fkey" FOREIGN KEY (goal_id) REFERENCES public.goals(id) ON DELETE SET NULL not valid;

alter table "public"."good_things" validate constraint "good_things_goal_id_fkey";

alter table "public"."good_things" add constraint "good_things_title_not_empty" CHECK ((char_length(TRIM(BOTH FROM title)) > 0)) not valid;

alter table "public"."good_things" validate constraint "good_things_title_not_empty";

alter table "public"."good_things" add constraint "good_things_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."good_things" validate constraint "good_things_user_id_fkey";

alter table "public"."user_roles" add constraint "user_roles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_roles" validate constraint "user_roles_user_id_fkey";

alter table "public"."user_roles" add constraint "user_roles_user_id_role_key" UNIQUE using index "user_roles_user_id_role_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_user_roles_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$
;

grant delete on table "public"."goals" to "anon";

grant insert on table "public"."goals" to "anon";

grant references on table "public"."goals" to "anon";

grant select on table "public"."goals" to "anon";

grant trigger on table "public"."goals" to "anon";

grant truncate on table "public"."goals" to "anon";

grant update on table "public"."goals" to "anon";

grant delete on table "public"."goals" to "authenticated";

grant insert on table "public"."goals" to "authenticated";

grant references on table "public"."goals" to "authenticated";

grant select on table "public"."goals" to "authenticated";

grant trigger on table "public"."goals" to "authenticated";

grant truncate on table "public"."goals" to "authenticated";

grant update on table "public"."goals" to "authenticated";

grant delete on table "public"."goals" to "service_role";

grant insert on table "public"."goals" to "service_role";

grant references on table "public"."goals" to "service_role";

grant select on table "public"."goals" to "service_role";

grant trigger on table "public"."goals" to "service_role";

grant truncate on table "public"."goals" to "service_role";

grant update on table "public"."goals" to "service_role";

grant delete on table "public"."good_things" to "anon";

grant insert on table "public"."good_things" to "anon";

grant references on table "public"."good_things" to "anon";

grant select on table "public"."good_things" to "anon";

grant trigger on table "public"."good_things" to "anon";

grant truncate on table "public"."good_things" to "anon";

grant update on table "public"."good_things" to "anon";

grant delete on table "public"."good_things" to "authenticated";

grant insert on table "public"."good_things" to "authenticated";

grant references on table "public"."good_things" to "authenticated";

grant select on table "public"."good_things" to "authenticated";

grant trigger on table "public"."good_things" to "authenticated";

grant truncate on table "public"."good_things" to "authenticated";

grant update on table "public"."good_things" to "authenticated";

grant delete on table "public"."good_things" to "service_role";

grant insert on table "public"."good_things" to "service_role";

grant references on table "public"."good_things" to "service_role";

grant select on table "public"."good_things" to "service_role";

grant trigger on table "public"."good_things" to "service_role";

grant truncate on table "public"."good_things" to "service_role";

grant update on table "public"."good_things" to "service_role";

grant delete on table "public"."prototypes" to "anon";

grant insert on table "public"."prototypes" to "anon";

grant references on table "public"."prototypes" to "anon";

grant select on table "public"."prototypes" to "anon";

grant trigger on table "public"."prototypes" to "anon";

grant truncate on table "public"."prototypes" to "anon";

grant update on table "public"."prototypes" to "anon";

grant delete on table "public"."prototypes" to "authenticated";

grant insert on table "public"."prototypes" to "authenticated";

grant references on table "public"."prototypes" to "authenticated";

grant select on table "public"."prototypes" to "authenticated";

grant trigger on table "public"."prototypes" to "authenticated";

grant truncate on table "public"."prototypes" to "authenticated";

grant update on table "public"."prototypes" to "authenticated";

grant delete on table "public"."prototypes" to "service_role";

grant insert on table "public"."prototypes" to "service_role";

grant references on table "public"."prototypes" to "service_role";

grant select on table "public"."prototypes" to "service_role";

grant trigger on table "public"."prototypes" to "service_role";

grant truncate on table "public"."prototypes" to "service_role";

grant update on table "public"."prototypes" to "service_role";

grant delete on table "public"."user_roles" to "anon";

grant insert on table "public"."user_roles" to "anon";

grant references on table "public"."user_roles" to "anon";

grant select on table "public"."user_roles" to "anon";

grant trigger on table "public"."user_roles" to "anon";

grant truncate on table "public"."user_roles" to "anon";

grant update on table "public"."user_roles" to "anon";

grant delete on table "public"."user_roles" to "authenticated";

grant insert on table "public"."user_roles" to "authenticated";

grant references on table "public"."user_roles" to "authenticated";

grant select on table "public"."user_roles" to "authenticated";

grant trigger on table "public"."user_roles" to "authenticated";

grant truncate on table "public"."user_roles" to "authenticated";

grant update on table "public"."user_roles" to "authenticated";

grant delete on table "public"."user_roles" to "service_role";

grant insert on table "public"."user_roles" to "service_role";

grant references on table "public"."user_roles" to "service_role";

grant select on table "public"."user_roles" to "service_role";

grant trigger on table "public"."user_roles" to "service_role";

grant truncate on table "public"."user_roles" to "service_role";

grant update on table "public"."user_roles" to "service_role";


  create policy "Users can delete their own goals"
  on "public"."goals"
  as permissive
  for delete
  to public
using ((auth.uid() = user_id));



  create policy "Users can insert their own goals"
  on "public"."goals"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can update their own goals"
  on "public"."goals"
  as permissive
  for update
  to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));



  create policy "Users can view their own goals"
  on "public"."goals"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Users can delete their own good things"
  on "public"."good_things"
  as permissive
  for delete
  to public
using ((auth.uid() = user_id));



  create policy "Users can insert their own good things"
  on "public"."good_things"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can update their own good things"
  on "public"."good_things"
  as permissive
  for update
  to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));



  create policy "Users can view their own good things"
  on "public"."good_things"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Users can view prototypes"
  on "public"."prototypes"
  as permissive
  for select
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "Users can manage their own roles"
  on "public"."user_roles"
  as permissive
  for all
  to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));



  create policy "Users can view their own roles"
  on "public"."user_roles"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));


CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON public.goals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_good_things_updated_at BEFORE UPDATE ON public.good_things FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_prototypes_updated_at BEFORE UPDATE ON public.prototypes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_roles_updated_at BEFORE UPDATE ON public.user_roles FOR EACH ROW EXECUTE FUNCTION public.update_user_roles_updated_at();


