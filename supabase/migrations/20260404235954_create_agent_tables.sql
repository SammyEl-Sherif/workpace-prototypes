create type "public"."agent_category" as enum ('Productivity', 'Communication', 'Data & Analytics', 'Content', 'Operations', 'Finance', 'Custom');

create type "public"."agent_pricing_type" as enum ('free', 'paid');


  create table "public"."agents" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "description" text,
    "description_long" text,
    "image_url" text,
    "category" public.agent_category not null default 'Productivity'::public.agent_category,
    "pricing_type" public.agent_pricing_type not null default 'free'::public.agent_pricing_type,
    "price_cents" integer not null default 0,
    "agent_link" text not null,
    "is_featured" boolean not null default false,
    "is_published" boolean not null default true,
    "sort_order" integer not null default 0,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."agents" enable row level security;

CREATE UNIQUE INDEX agents_pkey ON public.agents USING btree (id);

CREATE INDEX idx_agents_category ON public.agents USING btree (category);

CREATE INDEX idx_agents_is_published ON public.agents USING btree (is_published);

CREATE INDEX idx_agents_pricing_type ON public.agents USING btree (pricing_type);

CREATE INDEX idx_agents_sort_order ON public.agents USING btree (sort_order);

alter table "public"."agents" add constraint "agents_pkey" PRIMARY KEY using index "agents_pkey";

alter table "public"."agents" add constraint "agents_price_check" CHECK ((((pricing_type = 'free'::public.agent_pricing_type) AND (price_cents = 0)) OR ((pricing_type = 'paid'::public.agent_pricing_type) AND (price_cents > 0)))) not valid;

alter table "public"."agents" validate constraint "agents_price_check";

grant delete on table "public"."agents" to "anon";

grant insert on table "public"."agents" to "anon";

grant references on table "public"."agents" to "anon";

grant select on table "public"."agents" to "anon";

grant trigger on table "public"."agents" to "anon";

grant truncate on table "public"."agents" to "anon";

grant update on table "public"."agents" to "anon";

grant delete on table "public"."agents" to "authenticated";

grant insert on table "public"."agents" to "authenticated";

grant references on table "public"."agents" to "authenticated";

grant select on table "public"."agents" to "authenticated";

grant trigger on table "public"."agents" to "authenticated";

grant truncate on table "public"."agents" to "authenticated";

grant update on table "public"."agents" to "authenticated";

grant delete on table "public"."agents" to "service_role";

grant insert on table "public"."agents" to "service_role";

grant references on table "public"."agents" to "service_role";

grant select on table "public"."agents" to "service_role";

grant trigger on table "public"."agents" to "service_role";

grant truncate on table "public"."agents" to "service_role";

grant update on table "public"."agents" to "service_role";


  create policy "Anyone can view published agents"
  on "public"."agents"
  as permissive
  for select
  to public
using ((is_published = true));



  create policy "Service role can manage agents"
  on "public"."agents"
  as permissive
  for all
  to public
using ((auth.role() = 'service_role'::text));


CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON public.agents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


