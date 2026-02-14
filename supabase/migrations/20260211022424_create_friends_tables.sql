
  create table "public"."friends" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "friend_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."friends" enable row level security;

CREATE UNIQUE INDEX friends_pkey ON public.friends USING btree (id);

CREATE UNIQUE INDEX friends_unique_pair ON public.friends USING btree (user_id, friend_id);

CREATE INDEX idx_friends_friend_id ON public.friends USING btree (friend_id);

CREATE INDEX idx_friends_user_id ON public.friends USING btree (user_id);

alter table "public"."friends" add constraint "friends_pkey" PRIMARY KEY using index "friends_pkey";

alter table "public"."friends" add constraint "friends_friend_id_fkey" FOREIGN KEY (friend_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."friends" validate constraint "friends_friend_id_fkey";

alter table "public"."friends" add constraint "friends_no_self_reference" CHECK ((user_id <> friend_id)) not valid;

alter table "public"."friends" validate constraint "friends_no_self_reference";

alter table "public"."friends" add constraint "friends_unique_pair" UNIQUE using index "friends_unique_pair";

alter table "public"."friends" add constraint "friends_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."friends" validate constraint "friends_user_id_fkey";

grant delete on table "public"."friends" to "anon";

grant insert on table "public"."friends" to "anon";

grant references on table "public"."friends" to "anon";

grant select on table "public"."friends" to "anon";

grant trigger on table "public"."friends" to "anon";

grant truncate on table "public"."friends" to "anon";

grant update on table "public"."friends" to "anon";

grant delete on table "public"."friends" to "authenticated";

grant insert on table "public"."friends" to "authenticated";

grant references on table "public"."friends" to "authenticated";

grant select on table "public"."friends" to "authenticated";

grant trigger on table "public"."friends" to "authenticated";

grant truncate on table "public"."friends" to "authenticated";

grant update on table "public"."friends" to "authenticated";

grant delete on table "public"."friends" to "service_role";

grant insert on table "public"."friends" to "service_role";

grant references on table "public"."friends" to "service_role";

grant select on table "public"."friends" to "service_role";

grant trigger on table "public"."friends" to "service_role";

grant truncate on table "public"."friends" to "service_role";

grant update on table "public"."friends" to "service_role";


  create policy "Users can add their own friends"
  on "public"."friends"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can remove their own friends"
  on "public"."friends"
  as permissive
  for delete
  to public
using ((auth.uid() = user_id));



  create policy "Users can view their own friends"
  on "public"."friends"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));


CREATE TRIGGER update_friends_updated_at BEFORE UPDATE ON public.friends FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


