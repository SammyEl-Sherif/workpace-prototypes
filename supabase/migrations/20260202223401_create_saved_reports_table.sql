
  create table "public"."saved_reports" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "title" text not null,
    "content" text not null,
    "format" text not null default 'markdown'::text,
    "prompt_used" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."saved_reports" enable row level security;

CREATE INDEX idx_saved_reports_created_at ON public.saved_reports USING btree (created_at DESC);

CREATE INDEX idx_saved_reports_user_id ON public.saved_reports USING btree (user_id);

CREATE UNIQUE INDEX saved_reports_pkey ON public.saved_reports USING btree (id);

alter table "public"."saved_reports" add constraint "saved_reports_pkey" PRIMARY KEY using index "saved_reports_pkey";

alter table "public"."saved_reports" add constraint "saved_reports_content_not_empty" CHECK ((char_length(TRIM(BOTH FROM content)) > 0)) not valid;

alter table "public"."saved_reports" validate constraint "saved_reports_content_not_empty";

alter table "public"."saved_reports" add constraint "saved_reports_format_check" CHECK ((format = ANY (ARRAY['markdown'::text, 'plaintext'::text]))) not valid;

alter table "public"."saved_reports" validate constraint "saved_reports_format_check";

alter table "public"."saved_reports" add constraint "saved_reports_title_not_empty" CHECK ((char_length(TRIM(BOTH FROM title)) > 0)) not valid;

alter table "public"."saved_reports" validate constraint "saved_reports_title_not_empty";

alter table "public"."saved_reports" add constraint "saved_reports_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."saved_reports" validate constraint "saved_reports_user_id_fkey";

grant delete on table "public"."saved_reports" to "anon";

grant insert on table "public"."saved_reports" to "anon";

grant references on table "public"."saved_reports" to "anon";

grant select on table "public"."saved_reports" to "anon";

grant trigger on table "public"."saved_reports" to "anon";

grant truncate on table "public"."saved_reports" to "anon";

grant update on table "public"."saved_reports" to "anon";

grant delete on table "public"."saved_reports" to "authenticated";

grant insert on table "public"."saved_reports" to "authenticated";

grant references on table "public"."saved_reports" to "authenticated";

grant select on table "public"."saved_reports" to "authenticated";

grant trigger on table "public"."saved_reports" to "authenticated";

grant truncate on table "public"."saved_reports" to "authenticated";

grant update on table "public"."saved_reports" to "authenticated";

grant delete on table "public"."saved_reports" to "service_role";

grant insert on table "public"."saved_reports" to "service_role";

grant references on table "public"."saved_reports" to "service_role";

grant select on table "public"."saved_reports" to "service_role";

grant trigger on table "public"."saved_reports" to "service_role";

grant truncate on table "public"."saved_reports" to "service_role";

grant update on table "public"."saved_reports" to "service_role";


  create policy "Users can delete their own saved reports"
  on "public"."saved_reports"
  as permissive
  for delete
  to public
using ((auth.uid() = user_id));



  create policy "Users can insert their own saved reports"
  on "public"."saved_reports"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can update their own saved reports"
  on "public"."saved_reports"
  as permissive
  for update
  to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));



  create policy "Users can view their own saved reports"
  on "public"."saved_reports"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));


CREATE TRIGGER update_saved_reports_updated_at BEFORE UPDATE ON public.saved_reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


