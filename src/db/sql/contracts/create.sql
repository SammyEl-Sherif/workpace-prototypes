INSERT INTO public.contracts (
  org_id, title, signing_method, template_id, document_url, signer_email, signer_name, created_by
)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
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
