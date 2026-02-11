create type "public"."challenge_invitation_status" as enum ('pending', 'accepted', 'declined');


  create table "public"."challenge_evidence" (
    "id" uuid not null default gen_random_uuid(),
    "challenge_id" uuid not null,
    "participant_user_id" uuid not null,
    "evidence_date" date not null,
    "file_name" text not null,
    "storage_path" text not null,
    "media_type" text not null,
    "media_url" text not null,
    "thumbnail_url" text,
    "file_size_bytes" bigint,
    "mime_type" text,
    "notes" text,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."challenge_evidence" enable row level security;


  create table "public"."challenge_invitations" (
    "id" uuid not null default gen_random_uuid(),
    "challenge_id" uuid not null,
    "inviter_user_id" uuid not null,
    "invitee_user_id" uuid not null,
    "status" public.challenge_invitation_status not null default 'pending'::public.challenge_invitation_status,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."challenge_invitations" enable row level security;


  create table "public"."challenge_participants" (
    "id" uuid not null default gen_random_uuid(),
    "challenge_id" uuid not null,
    "user_id" uuid not null,
    "joined_at" timestamp with time zone not null default now(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."challenge_participants" enable row level security;


  create table "public"."challenges" (
    "id" uuid not null default gen_random_uuid(),
    "creator_user_id" uuid not null,
    "goal_id" uuid not null,
    "name" text not null,
    "description" text,
    "duration_days" integer not null,
    "task_description" text not null,
    "start_date" date not null,
    "end_date" date not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."challenges" enable row level security;

CREATE UNIQUE INDEX challenge_evidence_pkey ON public.challenge_evidence USING btree (id);

CREATE UNIQUE INDEX challenge_evidence_unique_per_day ON public.challenge_evidence USING btree (challenge_id, participant_user_id, evidence_date);

CREATE UNIQUE INDEX challenge_invitations_pkey ON public.challenge_invitations USING btree (id);

CREATE UNIQUE INDEX challenge_invitations_unique ON public.challenge_invitations USING btree (challenge_id, invitee_user_id);

CREATE UNIQUE INDEX challenge_participants_pkey ON public.challenge_participants USING btree (id);

CREATE UNIQUE INDEX challenge_participants_unique ON public.challenge_participants USING btree (challenge_id, user_id);

CREATE UNIQUE INDEX challenges_pkey ON public.challenges USING btree (id);

CREATE INDEX idx_challenge_evidence_challenge_id ON public.challenge_evidence USING btree (challenge_id);

CREATE INDEX idx_challenge_evidence_evidence_date ON public.challenge_evidence USING btree (evidence_date);

CREATE INDEX idx_challenge_evidence_participant_user_id ON public.challenge_evidence USING btree (participant_user_id);

CREATE INDEX idx_challenge_invitations_challenge_id ON public.challenge_invitations USING btree (challenge_id);

CREATE INDEX idx_challenge_invitations_invitee_user_id ON public.challenge_invitations USING btree (invitee_user_id);

CREATE INDEX idx_challenge_invitations_inviter_user_id ON public.challenge_invitations USING btree (inviter_user_id);

CREATE INDEX idx_challenge_invitations_status ON public.challenge_invitations USING btree (status);

CREATE INDEX idx_challenge_participants_challenge_id ON public.challenge_participants USING btree (challenge_id);

CREATE INDEX idx_challenge_participants_user_id ON public.challenge_participants USING btree (user_id);

CREATE INDEX idx_challenges_creator_user_id ON public.challenges USING btree (creator_user_id);

CREATE INDEX idx_challenges_end_date ON public.challenges USING btree (end_date);

CREATE INDEX idx_challenges_goal_id ON public.challenges USING btree (goal_id);

CREATE INDEX idx_challenges_start_date ON public.challenges USING btree (start_date);

alter table "public"."challenge_evidence" add constraint "challenge_evidence_pkey" PRIMARY KEY using index "challenge_evidence_pkey";

alter table "public"."challenge_invitations" add constraint "challenge_invitations_pkey" PRIMARY KEY using index "challenge_invitations_pkey";

alter table "public"."challenge_participants" add constraint "challenge_participants_pkey" PRIMARY KEY using index "challenge_participants_pkey";

alter table "public"."challenges" add constraint "challenges_pkey" PRIMARY KEY using index "challenges_pkey";

alter table "public"."challenge_evidence" add constraint "challenge_evidence_challenge_id_fkey" FOREIGN KEY (challenge_id) REFERENCES public.challenges(id) ON DELETE CASCADE not valid;

alter table "public"."challenge_evidence" validate constraint "challenge_evidence_challenge_id_fkey";

alter table "public"."challenge_evidence" add constraint "challenge_evidence_media_type_check" CHECK ((media_type = ANY (ARRAY['photo'::text, 'video'::text]))) not valid;

alter table "public"."challenge_evidence" validate constraint "challenge_evidence_media_type_check";

alter table "public"."challenge_evidence" add constraint "challenge_evidence_participant_user_id_fkey" FOREIGN KEY (participant_user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."challenge_evidence" validate constraint "challenge_evidence_participant_user_id_fkey";

alter table "public"."challenge_evidence" add constraint "challenge_evidence_unique_per_day" UNIQUE using index "challenge_evidence_unique_per_day";

alter table "public"."challenge_invitations" add constraint "challenge_invitations_challenge_id_fkey" FOREIGN KEY (challenge_id) REFERENCES public.challenges(id) ON DELETE CASCADE not valid;

alter table "public"."challenge_invitations" validate constraint "challenge_invitations_challenge_id_fkey";

alter table "public"."challenge_invitations" add constraint "challenge_invitations_invitee_user_id_fkey" FOREIGN KEY (invitee_user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."challenge_invitations" validate constraint "challenge_invitations_invitee_user_id_fkey";

alter table "public"."challenge_invitations" add constraint "challenge_invitations_inviter_user_id_fkey" FOREIGN KEY (inviter_user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."challenge_invitations" validate constraint "challenge_invitations_inviter_user_id_fkey";

alter table "public"."challenge_invitations" add constraint "challenge_invitations_no_self_reference" CHECK ((inviter_user_id <> invitee_user_id)) not valid;

alter table "public"."challenge_invitations" validate constraint "challenge_invitations_no_self_reference";

alter table "public"."challenge_invitations" add constraint "challenge_invitations_unique" UNIQUE using index "challenge_invitations_unique";

alter table "public"."challenge_participants" add constraint "challenge_participants_challenge_id_fkey" FOREIGN KEY (challenge_id) REFERENCES public.challenges(id) ON DELETE CASCADE not valid;

alter table "public"."challenge_participants" validate constraint "challenge_participants_challenge_id_fkey";

alter table "public"."challenge_participants" add constraint "challenge_participants_unique" UNIQUE using index "challenge_participants_unique";

alter table "public"."challenge_participants" add constraint "challenge_participants_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."challenge_participants" validate constraint "challenge_participants_user_id_fkey";

alter table "public"."challenges" add constraint "challenges_creator_user_id_fkey" FOREIGN KEY (creator_user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."challenges" validate constraint "challenges_creator_user_id_fkey";

alter table "public"."challenges" add constraint "challenges_duration_days_check" CHECK ((duration_days > 0)) not valid;

alter table "public"."challenges" validate constraint "challenges_duration_days_check";

alter table "public"."challenges" add constraint "challenges_end_after_start" CHECK ((end_date >= start_date)) not valid;

alter table "public"."challenges" validate constraint "challenges_end_after_start";

alter table "public"."challenges" add constraint "challenges_goal_id_fkey" FOREIGN KEY (goal_id) REFERENCES public.goals(id) ON DELETE CASCADE not valid;

alter table "public"."challenges" validate constraint "challenges_goal_id_fkey";

alter table "public"."challenges" add constraint "challenges_name_not_empty" CHECK ((char_length(TRIM(BOTH FROM name)) > 0)) not valid;

alter table "public"."challenges" validate constraint "challenges_name_not_empty";

alter table "public"."challenges" add constraint "challenges_task_not_empty" CHECK ((char_length(TRIM(BOTH FROM task_description)) > 0)) not valid;

alter table "public"."challenges" validate constraint "challenges_task_not_empty";

grant delete on table "public"."challenge_evidence" to "anon";

grant insert on table "public"."challenge_evidence" to "anon";

grant references on table "public"."challenge_evidence" to "anon";

grant select on table "public"."challenge_evidence" to "anon";

grant trigger on table "public"."challenge_evidence" to "anon";

grant truncate on table "public"."challenge_evidence" to "anon";

grant update on table "public"."challenge_evidence" to "anon";

grant delete on table "public"."challenge_evidence" to "authenticated";

grant insert on table "public"."challenge_evidence" to "authenticated";

grant references on table "public"."challenge_evidence" to "authenticated";

grant select on table "public"."challenge_evidence" to "authenticated";

grant trigger on table "public"."challenge_evidence" to "authenticated";

grant truncate on table "public"."challenge_evidence" to "authenticated";

grant update on table "public"."challenge_evidence" to "authenticated";

grant delete on table "public"."challenge_evidence" to "service_role";

grant insert on table "public"."challenge_evidence" to "service_role";

grant references on table "public"."challenge_evidence" to "service_role";

grant select on table "public"."challenge_evidence" to "service_role";

grant trigger on table "public"."challenge_evidence" to "service_role";

grant truncate on table "public"."challenge_evidence" to "service_role";

grant update on table "public"."challenge_evidence" to "service_role";

grant delete on table "public"."challenge_invitations" to "anon";

grant insert on table "public"."challenge_invitations" to "anon";

grant references on table "public"."challenge_invitations" to "anon";

grant select on table "public"."challenge_invitations" to "anon";

grant trigger on table "public"."challenge_invitations" to "anon";

grant truncate on table "public"."challenge_invitations" to "anon";

grant update on table "public"."challenge_invitations" to "anon";

grant delete on table "public"."challenge_invitations" to "authenticated";

grant insert on table "public"."challenge_invitations" to "authenticated";

grant references on table "public"."challenge_invitations" to "authenticated";

grant select on table "public"."challenge_invitations" to "authenticated";

grant trigger on table "public"."challenge_invitations" to "authenticated";

grant truncate on table "public"."challenge_invitations" to "authenticated";

grant update on table "public"."challenge_invitations" to "authenticated";

grant delete on table "public"."challenge_invitations" to "service_role";

grant insert on table "public"."challenge_invitations" to "service_role";

grant references on table "public"."challenge_invitations" to "service_role";

grant select on table "public"."challenge_invitations" to "service_role";

grant trigger on table "public"."challenge_invitations" to "service_role";

grant truncate on table "public"."challenge_invitations" to "service_role";

grant update on table "public"."challenge_invitations" to "service_role";

grant delete on table "public"."challenge_participants" to "anon";

grant insert on table "public"."challenge_participants" to "anon";

grant references on table "public"."challenge_participants" to "anon";

grant select on table "public"."challenge_participants" to "anon";

grant trigger on table "public"."challenge_participants" to "anon";

grant truncate on table "public"."challenge_participants" to "anon";

grant update on table "public"."challenge_participants" to "anon";

grant delete on table "public"."challenge_participants" to "authenticated";

grant insert on table "public"."challenge_participants" to "authenticated";

grant references on table "public"."challenge_participants" to "authenticated";

grant select on table "public"."challenge_participants" to "authenticated";

grant trigger on table "public"."challenge_participants" to "authenticated";

grant truncate on table "public"."challenge_participants" to "authenticated";

grant update on table "public"."challenge_participants" to "authenticated";

grant delete on table "public"."challenge_participants" to "service_role";

grant insert on table "public"."challenge_participants" to "service_role";

grant references on table "public"."challenge_participants" to "service_role";

grant select on table "public"."challenge_participants" to "service_role";

grant trigger on table "public"."challenge_participants" to "service_role";

grant truncate on table "public"."challenge_participants" to "service_role";

grant update on table "public"."challenge_participants" to "service_role";

grant delete on table "public"."challenges" to "anon";

grant insert on table "public"."challenges" to "anon";

grant references on table "public"."challenges" to "anon";

grant select on table "public"."challenges" to "anon";

grant trigger on table "public"."challenges" to "anon";

grant truncate on table "public"."challenges" to "anon";

grant update on table "public"."challenges" to "anon";

grant delete on table "public"."challenges" to "authenticated";

grant insert on table "public"."challenges" to "authenticated";

grant references on table "public"."challenges" to "authenticated";

grant select on table "public"."challenges" to "authenticated";

grant trigger on table "public"."challenges" to "authenticated";

grant truncate on table "public"."challenges" to "authenticated";

grant update on table "public"."challenges" to "authenticated";

grant delete on table "public"."challenges" to "service_role";

grant insert on table "public"."challenges" to "service_role";

grant references on table "public"."challenges" to "service_role";

grant select on table "public"."challenges" to "service_role";

grant trigger on table "public"."challenges" to "service_role";

grant truncate on table "public"."challenges" to "service_role";

grant update on table "public"."challenges" to "service_role";


  create policy "Users can delete their own evidence"
  on "public"."challenge_evidence"
  as permissive
  for delete
  to public
using ((auth.uid() = participant_user_id));



  create policy "Users can update their own evidence"
  on "public"."challenge_evidence"
  as permissive
  for update
  to public
using ((auth.uid() = participant_user_id))
with check ((auth.uid() = participant_user_id));



  create policy "Users can upload their own evidence"
  on "public"."challenge_evidence"
  as permissive
  for insert
  to public
with check (((auth.uid() = participant_user_id) AND (EXISTS ( SELECT 1
   FROM public.challenge_participants
  WHERE ((challenge_participants.challenge_id = challenge_evidence.challenge_id) AND (challenge_participants.user_id = auth.uid()))))));



  create policy "Users can view evidence in challenges they participate in"
  on "public"."challenge_evidence"
  as permissive
  for select
  to public
using (((participant_user_id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM public.challenge_participants
  WHERE ((challenge_participants.challenge_id = challenge_evidence.challenge_id) AND (challenge_participants.user_id = auth.uid()))))));



  create policy "Users can create invitations"
  on "public"."challenge_invitations"
  as permissive
  for insert
  to public
with check ((auth.uid() = inviter_user_id));



  create policy "Users can update invitations they received"
  on "public"."challenge_invitations"
  as permissive
  for update
  to public
using ((auth.uid() = invitee_user_id))
with check ((auth.uid() = invitee_user_id));



  create policy "Users can view invitations they sent or received"
  on "public"."challenge_invitations"
  as permissive
  for select
  to public
using (((auth.uid() = inviter_user_id) OR (auth.uid() = invitee_user_id)));



  create policy "Users can join challenges"
  on "public"."challenge_participants"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can leave challenges"
  on "public"."challenge_participants"
  as permissive
  for delete
  to public
using ((auth.uid() = user_id));



  create policy "Users can view participants in their challenges"
  on "public"."challenge_participants"
  as permissive
  for select
  to public
using (((user_id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM public.challenges
  WHERE ((challenges.id = challenge_participants.challenge_id) AND (challenges.creator_user_id = auth.uid())))) OR (EXISTS ( SELECT 1
   FROM public.challenge_participants cp
  WHERE ((cp.challenge_id = challenge_participants.challenge_id) AND (cp.user_id = auth.uid()))))));



  create policy "Users can create challenges"
  on "public"."challenges"
  as permissive
  for insert
  to public
with check ((auth.uid() = creator_user_id));



  create policy "Users can delete challenges they created"
  on "public"."challenges"
  as permissive
  for delete
  to public
using ((auth.uid() = creator_user_id));



  create policy "Users can update challenges they created"
  on "public"."challenges"
  as permissive
  for update
  to public
using ((auth.uid() = creator_user_id))
with check ((auth.uid() = creator_user_id));



  create policy "Users can view challenges they participate in"
  on "public"."challenges"
  as permissive
  for select
  to public
using (((creator_user_id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM public.challenge_participants
  WHERE ((challenge_participants.challenge_id = challenges.id) AND (challenge_participants.user_id = auth.uid()))))));


CREATE TRIGGER update_challenge_invitations_updated_at BEFORE UPDATE ON public.challenge_invitations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_challenge_participants_updated_at BEFORE UPDATE ON public.challenge_participants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_challenges_updated_at BEFORE UPDATE ON public.challenges FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


