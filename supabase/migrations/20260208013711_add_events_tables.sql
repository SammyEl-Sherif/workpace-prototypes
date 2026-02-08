create type "public"."invite_status" as enum ('pending', 'sent', 'bounced', 'confirmed', 'declined');


  create table "public"."event_guests" (
    "id" uuid not null default gen_random_uuid(),
    "event_id" uuid not null,
    "user_id" uuid,
    "phone_number" text not null,
    "name" text,
    "invite_status" public.invite_status not null default 'pending'::public.invite_status,
    "sms_invite_message_id" text,
    "last_invite_sent_at" timestamp with time zone,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."event_guests" enable row level security;


  create table "public"."events" (
    "id" uuid not null default gen_random_uuid(),
    "creator_user_id" uuid not null,
    "title" text not null,
    "description" text,
    "starts_at" timestamp with time zone not null,
    "location" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."events" enable row level security;

CREATE UNIQUE INDEX event_guests_pkey ON public.event_guests USING btree (id);

CREATE UNIQUE INDEX events_pkey ON public.events USING btree (id);

CREATE INDEX idx_event_guests_event_id ON public.event_guests USING btree (event_id);

CREATE INDEX idx_event_guests_invite_status ON public.event_guests USING btree (invite_status);

CREATE INDEX idx_event_guests_user_id ON public.event_guests USING btree (user_id);

CREATE INDEX idx_events_creator_user_id ON public.events USING btree (creator_user_id);

CREATE INDEX idx_events_starts_at ON public.events USING btree (starts_at);

alter table "public"."event_guests" add constraint "event_guests_pkey" PRIMARY KEY using index "event_guests_pkey";

alter table "public"."events" add constraint "events_pkey" PRIMARY KEY using index "events_pkey";

alter table "public"."event_guests" add constraint "event_guests_event_id_fkey" FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE not valid;

alter table "public"."event_guests" validate constraint "event_guests_event_id_fkey";

alter table "public"."event_guests" add constraint "event_guests_phone_not_empty" CHECK ((char_length(TRIM(BOTH FROM phone_number)) > 0)) not valid;

alter table "public"."event_guests" validate constraint "event_guests_phone_not_empty";

alter table "public"."event_guests" add constraint "event_guests_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "public"."event_guests" validate constraint "event_guests_user_id_fkey";

alter table "public"."events" add constraint "events_creator_user_id_fkey" FOREIGN KEY (creator_user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."events" validate constraint "events_creator_user_id_fkey";

alter table "public"."events" add constraint "events_title_not_empty" CHECK ((char_length(TRIM(BOTH FROM title)) > 0)) not valid;

alter table "public"."events" validate constraint "events_title_not_empty";

grant delete on table "public"."event_guests" to "anon";

grant insert on table "public"."event_guests" to "anon";

grant references on table "public"."event_guests" to "anon";

grant select on table "public"."event_guests" to "anon";

grant trigger on table "public"."event_guests" to "anon";

grant truncate on table "public"."event_guests" to "anon";

grant update on table "public"."event_guests" to "anon";

grant delete on table "public"."event_guests" to "authenticated";

grant insert on table "public"."event_guests" to "authenticated";

grant references on table "public"."event_guests" to "authenticated";

grant select on table "public"."event_guests" to "authenticated";

grant trigger on table "public"."event_guests" to "authenticated";

grant truncate on table "public"."event_guests" to "authenticated";

grant update on table "public"."event_guests" to "authenticated";

grant delete on table "public"."event_guests" to "service_role";

grant insert on table "public"."event_guests" to "service_role";

grant references on table "public"."event_guests" to "service_role";

grant select on table "public"."event_guests" to "service_role";

grant trigger on table "public"."event_guests" to "service_role";

grant truncate on table "public"."event_guests" to "service_role";

grant update on table "public"."event_guests" to "service_role";

grant delete on table "public"."events" to "anon";

grant insert on table "public"."events" to "anon";

grant references on table "public"."events" to "anon";

grant select on table "public"."events" to "anon";

grant trigger on table "public"."events" to "anon";

grant truncate on table "public"."events" to "anon";

grant update on table "public"."events" to "anon";

grant delete on table "public"."events" to "authenticated";

grant insert on table "public"."events" to "authenticated";

grant references on table "public"."events" to "authenticated";

grant select on table "public"."events" to "authenticated";

grant trigger on table "public"."events" to "authenticated";

grant truncate on table "public"."events" to "authenticated";

grant update on table "public"."events" to "authenticated";

grant delete on table "public"."events" to "service_role";

grant insert on table "public"."events" to "service_role";

grant references on table "public"."events" to "service_role";

grant select on table "public"."events" to "service_role";

grant trigger on table "public"."events" to "service_role";

grant truncate on table "public"."events" to "service_role";

grant update on table "public"."events" to "service_role";


  create policy "Event creators can delete guests"
  on "public"."event_guests"
  as permissive
  for delete
  to public
using ((EXISTS ( SELECT 1
   FROM public.events
  WHERE ((events.id = event_guests.event_id) AND (events.creator_user_id = auth.uid())))));



  create policy "Event creators can insert guests"
  on "public"."event_guests"
  as permissive
  for insert
  to public
with check ((EXISTS ( SELECT 1
   FROM public.events
  WHERE ((events.id = event_guests.event_id) AND (events.creator_user_id = auth.uid())))));



  create policy "Event creators can update guests"
  on "public"."event_guests"
  as permissive
  for update
  to public
using ((EXISTS ( SELECT 1
   FROM public.events
  WHERE ((events.id = event_guests.event_id) AND (events.creator_user_id = auth.uid())))))
with check ((EXISTS ( SELECT 1
   FROM public.events
  WHERE ((events.id = event_guests.event_id) AND (events.creator_user_id = auth.uid())))));



  create policy "Event creators can view guests"
  on "public"."event_guests"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.events
  WHERE ((events.id = event_guests.event_id) AND (events.creator_user_id = auth.uid())))));



  create policy "Users can delete their own events"
  on "public"."events"
  as permissive
  for delete
  to public
using ((auth.uid() = creator_user_id));



  create policy "Users can insert their own events"
  on "public"."events"
  as permissive
  for insert
  to public
with check ((auth.uid() = creator_user_id));



  create policy "Users can update their own events"
  on "public"."events"
  as permissive
  for update
  to public
using ((auth.uid() = creator_user_id))
with check ((auth.uid() = creator_user_id));



  create policy "Users can view their own events"
  on "public"."events"
  as permissive
  for select
  to public
using ((auth.uid() = creator_user_id));


CREATE TRIGGER update_event_guests_updated_at BEFORE UPDATE ON public.event_guests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


