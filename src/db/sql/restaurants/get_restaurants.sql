SELECT * FROM public.restaurants
WHERE
  ($1::text IS NULL OR (
    name ILIKE '%' || $1 || '%' OR
    type ILIKE '%' || $1 || '%' OR
    EXISTS (
      SELECT 1 FROM unnest(cuisine_tags) AS tag
      WHERE tag ILIKE '%' || $1 || '%'
    )
  ))
  AND ($2::text IS NULL OR type = $2)
  AND ($3::text IS NULL OR city = $3)
  AND ($4::text IS NULL OR cuisine_tags @> ARRAY[$4]::text[])
  AND ($5::text[] IS NULL OR cuisine_tags && $5)
ORDER BY id
LIMIT $6 OFFSET $7;

