export type AgentCategory =
  | 'Productivity'
  | 'Communication'
  | 'Data & Analytics'
  | 'Content'
  | 'Operations'
  | 'Finance'
  | 'Custom'

export type AgentPricingType = 'free' | 'paid'

export interface Agent {
  id: string
  title: string
  description: string | null
  description_long: string | null
  image_url: string | null
  category: AgentCategory
  pricing_type: AgentPricingType
  price_cents: number
  agent_link: string
  is_featured: boolean
  updated_at: string
}
