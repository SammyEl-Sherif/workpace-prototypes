SELECT
  id,
  title,
  description,
  image_url,
  category,
  pricing_type,
  price_cents,
  template_link,
  is_featured,
  updated_at
FROM public.notion_templates
WHERE is_published = true
ORDER BY is_featured DESC, sort_order ASC, updated_at DESC;
