SELECT
  id,
  title,
  description,
  description_long,
  image_url,
  category,
  pricing_type,
  price_cents,
  agent_link,
  is_featured,
  updated_at
FROM public.agents
WHERE is_published = true
ORDER BY is_featured DESC, sort_order ASC, updated_at DESC;
