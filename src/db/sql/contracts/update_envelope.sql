UPDATE public.contracts
SET
  envelope_id = $2,
  status = 'sent'::public.contract_status,
  sent_at = NOW(),
  updated_at = NOW()
WHERE id = $1
RETURNING
  id,
  org_id,
  title,
  version,
  status::text,
  signing_method::text,
  envelope_id,
  template_id,
  document_url,
  signer_email,
  signer_name,
  sent_at,
  signed_at,
  voided_at,
  created_by,
  created_at,
  updated_at;
