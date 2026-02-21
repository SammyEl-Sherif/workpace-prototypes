UPDATE public.contracts
SET
  voided_at = NOW(),
  updated_at = NOW()
WHERE org_id = $1
  AND title = $2
  AND id != $3
  AND voided_at IS NULL;
