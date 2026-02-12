alter table "public"."good_things" add column "challenge_id" uuid;

CREATE INDEX idx_good_things_challenge_id ON public.good_things USING btree (challenge_id);

alter table "public"."good_things" add constraint "good_things_challenge_id_fkey" FOREIGN KEY (challenge_id) REFERENCES public.challenges(id) ON DELETE SET NULL not valid;

alter table "public"."good_things" validate constraint "good_things_challenge_id_fkey";


