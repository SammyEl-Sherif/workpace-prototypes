create type "public"."template_category" as enum ('Productivity', 'Work', 'Education', 'Health & Fitness', 'Finance', 'Travel', 'Seasonal');

create type "public"."template_pricing_type" as enum ('free', 'paid');


  create table "public"."notion_templates" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "description" text,
    "image_url" text,
    "category" public.template_category not null default 'Productivity'::public.template_category,
    "pricing_type" public.template_pricing_type not null default 'free'::public.template_pricing_type,
    "price_cents" integer not null default 0,
    "template_link" text not null,
    "is_featured" boolean not null default false,
    "is_published" boolean not null default true,
    "sort_order" integer not null default 0,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."notion_templates" enable row level security;

CREATE INDEX idx_notion_templates_category ON public.notion_templates USING btree (category);

CREATE INDEX idx_notion_templates_is_published ON public.notion_templates USING btree (is_published);

CREATE INDEX idx_notion_templates_pricing_type ON public.notion_templates USING btree (pricing_type);

CREATE INDEX idx_notion_templates_sort_order ON public.notion_templates USING btree (sort_order);

CREATE UNIQUE INDEX notion_templates_pkey ON public.notion_templates USING btree (id);

alter table "public"."notion_templates" add constraint "notion_templates_pkey" PRIMARY KEY using index "notion_templates_pkey";

alter table "public"."notion_templates" add constraint "notion_templates_price_check" CHECK ((((pricing_type = 'free'::public.template_pricing_type) AND (price_cents = 0)) OR ((pricing_type = 'paid'::public.template_pricing_type) AND (price_cents > 0)))) not valid;

alter table "public"."notion_templates" validate constraint "notion_templates_price_check";

grant delete on table "public"."notion_templates" to "anon";

grant insert on table "public"."notion_templates" to "anon";

grant references on table "public"."notion_templates" to "anon";

grant select on table "public"."notion_templates" to "anon";

grant trigger on table "public"."notion_templates" to "anon";

grant truncate on table "public"."notion_templates" to "anon";

grant update on table "public"."notion_templates" to "anon";

grant delete on table "public"."notion_templates" to "authenticated";

grant insert on table "public"."notion_templates" to "authenticated";

grant references on table "public"."notion_templates" to "authenticated";

grant select on table "public"."notion_templates" to "authenticated";

grant trigger on table "public"."notion_templates" to "authenticated";

grant truncate on table "public"."notion_templates" to "authenticated";

grant update on table "public"."notion_templates" to "authenticated";

grant delete on table "public"."notion_templates" to "service_role";

grant insert on table "public"."notion_templates" to "service_role";

grant references on table "public"."notion_templates" to "service_role";

grant select on table "public"."notion_templates" to "service_role";

grant trigger on table "public"."notion_templates" to "service_role";

grant truncate on table "public"."notion_templates" to "service_role";

grant update on table "public"."notion_templates" to "service_role";


  create policy "Anyone can view published templates"
  on "public"."notion_templates"
  as permissive
  for select
  to public
using ((is_published = true));



  create policy "Service role can manage templates"
  on "public"."notion_templates"
  as permissive
  for all
  to public
using ((auth.role() = 'service_role'::text));


CREATE TRIGGER update_notion_templates_updated_at BEFORE UPDATE ON public.notion_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


