export type TemplateCategory =
  | 'Productivity'
  | 'Work'
  | 'Education'
  | 'Health & Fitness'
  | 'Finance'
  | 'Travel'
  | 'Seasonal'

export type TemplatePricingType = 'free' | 'paid'

export interface NotionTemplate {
  id: string
  title: string
  description: string | null
  description_long: string | null
  image_url: string | null
  category: TemplateCategory
  pricing_type: TemplatePricingType
  price_cents: number
  template_link: string
  is_featured: boolean
  updated_at: string
}
