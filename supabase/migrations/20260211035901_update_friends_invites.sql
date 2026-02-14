create type "public"."friend_invitation_status" as enum ('pending', 'accepted', 'declined');


  create table "public"."friend_invitations" (
    "id" uuid not null default gen_random_uuid(),
    "inviter_user_id" uuid not null,
    "invitee_user_id" uuid not null,
    "status" public.friend_invitation_status not null default 'pending'::public.friend_invitation_status,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."friend_invitations" enable row level security;

CREATE UNIQUE INDEX friend_invitations_pkey ON public.friend_invitations USING btree (id);

CREATE UNIQUE INDEX friend_invitations_unique ON public.friend_invitations USING btree (inviter_user_id, invitee_user_id);

CREATE INDEX idx_friend_invitations_invitee_user_id ON public.friend_invitations USING btree (invitee_user_id);

CREATE INDEX idx_friend_invitations_inviter_user_id ON public.friend_invitations USING btree (inviter_user_id);

CREATE INDEX idx_friend_invitations_status ON public.friend_invitations USING btree (status);

alter table "public"."friend_invitations" add constraint "friend_invitations_pkey" PRIMARY KEY using index "friend_invitations_pkey";

alter table "public"."friend_invitations" add constraint "friend_invitations_invitee_user_id_fkey" FOREIGN KEY (invitee_user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."friend_invitations" validate constraint "friend_invitations_invitee_user_id_fkey";

alter table "public"."friend_invitations" add constraint "friend_invitations_inviter_user_id_fkey" FOREIGN KEY (inviter_user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."friend_invitations" validate constraint "friend_invitations_inviter_user_id_fkey";

alter table "public"."friend_invitations" add constraint "friend_invitations_no_self_reference" CHECK ((inviter_user_id <> invitee_user_id)) not valid;

alter table "public"."friend_invitations" validate constraint "friend_invitations_no_self_reference";

alter table "public"."friend_invitations" add constraint "friend_invitations_unique" UNIQUE using index "friend_invitations_unique";

grant delete on table "public"."friend_invitations" to "anon";

grant insert on table "public"."friend_invitations" to "anon";

grant references on table "public"."friend_invitations" to "anon";

grant select on table "public"."friend_invitations" to "anon";

grant trigger on table "public"."friend_invitations" to "anon";

grant truncate on table "public"."friend_invitations" to "anon";

grant update on table "public"."friend_invitations" to "anon";

grant delete on table "public"."friend_invitations" to "authenticated";

grant insert on table "public"."friend_invitations" to "authenticated";

grant references on table "public"."friend_invitations" to "authenticated";

grant select on table "public"."friend_invitations" to "authenticated";

grant trigger on table "public"."friend_invitations" to "authenticated";

grant truncate on table "public"."friend_invitations" to "authenticated";

grant update on table "public"."friend_invitations" to "authenticated";

grant delete on table "public"."friend_invitations" to "service_role";

grant insert on table "public"."friend_invitations" to "service_role";

grant references on table "public"."friend_invitations" to "service_role";

grant select on table "public"."friend_invitations" to "service_role";

grant trigger on table "public"."friend_invitations" to "service_role";

grant truncate on table "public"."friend_invitations" to "service_role";

grant update on table "public"."friend_invitations" to "service_role";


  create policy "Invited users can update their invitation status"
  on "public"."friend_invitations"
  as permissive
  for update
  to public
using ((invitee_user_id = auth.uid()))
with check ((invitee_user_id = auth.uid()));



  create policy "Users can create invitations"
  on "public"."friend_invitations"
  as permissive
  for insert
  to public
with check ((inviter_user_id = auth.uid()));



  create policy "Users can delete their own invitations"
  on "public"."friend_invitations"
  as permissive
  for delete
  to public
using (((inviter_user_id = auth.uid()) OR (invitee_user_id = auth.uid())));



  create policy "Users can view their own invitations"
  on "public"."friend_invitations"
  as permissive
  for select
  to public
using (((inviter_user_id = auth.uid()) OR (invitee_user_id = auth.uid())));


CREATE TRIGGER update_friend_invitations_updated_at BEFORE UPDATE ON public.friend_invitations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


