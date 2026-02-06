
  create table "public"."good_thing_media" (
    "id" uuid not null default gen_random_uuid(),
    "good_thing_id" uuid not null,
    "user_id" uuid not null,
    "file_name" text not null,
    "storage_path" text not null,
    "media_type" text not null,
    "media_url" text not null,
    "thumbnail_url" text,
    "file_size_bytes" bigint,
    "mime_type" text,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."good_thing_media" enable row level security;

CREATE UNIQUE INDEX good_thing_media_pkey ON public.good_thing_media USING btree (id);

CREATE INDEX idx_good_thing_media_good_thing_id ON public.good_thing_media USING btree (good_thing_id);

CREATE INDEX idx_good_thing_media_user_id ON public.good_thing_media USING btree (user_id);

alter table "public"."good_thing_media" add constraint "good_thing_media_pkey" PRIMARY KEY using index "good_thing_media_pkey";

alter table "public"."good_thing_media" add constraint "good_thing_media_good_thing_id_fkey" FOREIGN KEY (good_thing_id) REFERENCES public.good_things(id) ON DELETE CASCADE not valid;

alter table "public"."good_thing_media" validate constraint "good_thing_media_good_thing_id_fkey";

alter table "public"."good_thing_media" add constraint "good_thing_media_media_type_check" CHECK ((media_type = ANY (ARRAY['photo'::text, 'video'::text]))) not valid;

alter table "public"."good_thing_media" validate constraint "good_thing_media_media_type_check";

alter table "public"."good_thing_media" add constraint "good_thing_media_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."good_thing_media" validate constraint "good_thing_media_user_id_fkey";

grant delete on table "public"."good_thing_media" to "anon";

grant insert on table "public"."good_thing_media" to "anon";

grant references on table "public"."good_thing_media" to "anon";

grant select on table "public"."good_thing_media" to "anon";

grant trigger on table "public"."good_thing_media" to "anon";

grant truncate on table "public"."good_thing_media" to "anon";

grant update on table "public"."good_thing_media" to "anon";

grant delete on table "public"."good_thing_media" to "authenticated";

grant insert on table "public"."good_thing_media" to "authenticated";

grant references on table "public"."good_thing_media" to "authenticated";

grant select on table "public"."good_thing_media" to "authenticated";

grant trigger on table "public"."good_thing_media" to "authenticated";

grant truncate on table "public"."good_thing_media" to "authenticated";

grant update on table "public"."good_thing_media" to "authenticated";

grant delete on table "public"."good_thing_media" to "service_role";

grant insert on table "public"."good_thing_media" to "service_role";

grant references on table "public"."good_thing_media" to "service_role";

grant select on table "public"."good_thing_media" to "service_role";

grant trigger on table "public"."good_thing_media" to "service_role";

grant truncate on table "public"."good_thing_media" to "service_role";

grant update on table "public"."good_thing_media" to "service_role";


  create policy "Users can delete their own media"
  on "public"."good_thing_media"
  as permissive
  for delete
  to public
using ((auth.uid() = user_id));



  create policy "Users can insert their own media"
  on "public"."good_thing_media"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can view their own media"
  on "public"."good_thing_media"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



