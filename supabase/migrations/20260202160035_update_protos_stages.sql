alter table "public"."prototypes" alter column "stage" drop default;

alter type "public"."prototype_stage" rename to "prototype_stage__old_version_to_be_dropped";

create type "public"."prototype_stage" as enum ('Concept', 'Prototype', 'Live');

alter table "public"."prototypes" alter column stage type "public"."prototype_stage" using stage::text::"public"."prototype_stage";

alter table "public"."prototypes" alter column "stage" set default 'Concept'::public.prototype_stage;

drop type "public"."prototype_stage__old_version_to_be_dropped";


