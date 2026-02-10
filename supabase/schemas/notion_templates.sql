-- Declarative Schema for Notion Templates Table
-- This file defines the desired final state of the notion_templates table

-- Create enum type for template categories
DO $$ BEGIN
  CREATE TYPE public.template_category AS ENUM (
    'Productivity',
    'Work',
    'Education',
    'Health & Fitness',
    'Finance',
    'Travel',
    'Seasonal'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create enum type for template pricing
DO $$ BEGIN
  CREATE TYPE public.template_pricing_type AS ENUM ('free', 'paid');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create notion_templates table
CREATE TABLE IF NOT EXISTS public.notion_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  description_long TEXT,
  image_url TEXT,
  category public.template_category NOT NULL DEFAULT 'Productivity'::template_category,
  pricing_type public.template_pricing_type NOT NULL DEFAULT 'free'::template_pricing_type,
  price_cents INTEGER NOT NULL DEFAULT 0,
  template_link TEXT NOT NULL,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT notion_templates_pkey PRIMARY KEY (id),
  CONSTRAINT notion_templates_price_check CHECK (
    (pricing_type = 'free' AND price_cents = 0) OR
    (pricing_type = 'paid' AND price_cents > 0)
  )
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_notion_templates_category ON public.notion_templates USING btree (category);
CREATE INDEX IF NOT EXISTS idx_notion_templates_pricing_type ON public.notion_templates USING btree (pricing_type);
CREATE INDEX IF NOT EXISTS idx_notion_templates_is_published ON public.notion_templates USING btree (is_published);
CREATE INDEX IF NOT EXISTS idx_notion_templates_sort_order ON public.notion_templates USING btree (sort_order);

-- Enable Row Level Security
ALTER TABLE public.notion_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies: anyone can view published templates (public storefront)
DROP POLICY IF EXISTS "Anyone can view published templates" ON public.notion_templates;
CREATE POLICY "Anyone can view published templates"
  ON public.notion_templates
  FOR SELECT
  USING (is_published = true);

-- RLS Policies: only service_role (server-side) can manage templates
-- This avoids a cross-table dependency on user_roles during schema init.
-- Admin writes should go through server-side API routes using the service_role key.
DROP POLICY IF EXISTS "Service role can manage templates" ON public.notion_templates;
CREATE POLICY "Service role can manage templates"
  ON public.notion_templates
  FOR ALL
  USING (auth.role() = 'service_role');

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_notion_templates_updated_at ON public.notion_templates;
CREATE TRIGGER update_notion_templates_updated_at
  BEFORE UPDATE ON public.notion_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
