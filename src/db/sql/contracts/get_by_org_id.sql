SELECT
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
  updated_at
FROM public.contracts
WHERE org_id = $1
ORDER BY created_at DESC;
