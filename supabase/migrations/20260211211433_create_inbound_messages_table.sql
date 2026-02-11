create type "public"."message_type" as enum ('text', 'email');


  create table "public"."inbound_messages" (
    "id" uuid not null default gen_random_uuid(),
    "type" public.message_type not null default 'text'::public.message_type,
    "sender_phone_number" text,
    "sender_email" text,
    "sender_name" text,
    "message_body" text not null,
    "subject" text,
    "received_at" timestamp with time zone not null default now(),
    "pingram_message_id" text,
    "raw_payload" jsonb,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."inbound_messages" enable row level security;

CREATE INDEX idx_inbound_messages_pingram_message_id ON public.inbound_messages USING btree (pingram_message_id);

CREATE INDEX idx_inbound_messages_received_at ON public.inbound_messages USING btree (received_at DESC);

CREATE INDEX idx_inbound_messages_sender_email ON public.inbound_messages USING btree (sender_email);

CREATE INDEX idx_inbound_messages_sender_phone_number ON public.inbound_messages USING btree (sender_phone_number);

CREATE INDEX idx_inbound_messages_type ON public.inbound_messages USING btree (type);

CREATE UNIQUE INDEX inbound_messages_pkey ON public.inbound_messages USING btree (id);

alter table "public"."inbound_messages" add constraint "inbound_messages_pkey" PRIMARY KEY using index "inbound_messages_pkey";

alter table "public"."inbound_messages" add constraint "inbound_messages_message_body_not_empty" CHECK ((char_length(TRIM(BOTH FROM message_body)) > 0)) not valid;

alter table "public"."inbound_messages" validate constraint "inbound_messages_message_body_not_empty";

alter table "public"."inbound_messages" add constraint "inbound_messages_sender_required" CHECK (((sender_phone_number IS NOT NULL) OR (sender_email IS NOT NULL))) not valid;

alter table "public"."inbound_messages" validate constraint "inbound_messages_sender_required";

grant delete on table "public"."inbound_messages" to "anon";

grant insert on table "public"."inbound_messages" to "anon";

grant references on table "public"."inbound_messages" to "anon";

grant select on table "public"."inbound_messages" to "anon";

grant trigger on table "public"."inbound_messages" to "anon";

grant truncate on table "public"."inbound_messages" to "anon";

grant update on table "public"."inbound_messages" to "anon";

grant delete on table "public"."inbound_messages" to "authenticated";

grant insert on table "public"."inbound_messages" to "authenticated";

grant references on table "public"."inbound_messages" to "authenticated";

grant select on table "public"."inbound_messages" to "authenticated";

grant trigger on table "public"."inbound_messages" to "authenticated";

grant truncate on table "public"."inbound_messages" to "authenticated";

grant update on table "public"."inbound_messages" to "authenticated";

grant delete on table "public"."inbound_messages" to "service_role";

grant insert on table "public"."inbound_messages" to "service_role";

grant references on table "public"."inbound_messages" to "service_role";

grant select on table "public"."inbound_messages" to "service_role";

grant trigger on table "public"."inbound_messages" to "service_role";

grant truncate on table "public"."inbound_messages" to "service_role";

grant update on table "public"."inbound_messages" to "service_role";


  create policy "Authenticated users can view inbound messages"
  on "public"."inbound_messages"
  as permissive
  for select
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "Service role can insert inbound messages"
  on "public"."inbound_messages"
  as permissive
  for insert
  to public
with check (true);


CREATE TRIGGER update_inbound_messages_updated_at BEFORE UPDATE ON public.inbound_messages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


